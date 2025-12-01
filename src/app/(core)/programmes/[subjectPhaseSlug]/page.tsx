import { notFound, redirect, RedirectType } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import {
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";
import CMSClient from "@/node-lib/cms";
import {
  formatCurriculumUnitsData,
  createDownloadsData,
  fetchSubjectPhasePickerData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";

const ProgrammePage = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  const isEnabled = await useFeatureFlag(
    "teachers-integrated-journey",
    "boolean",
  );

  const slugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!slugs || !isEnabled) {
    return notFound();
  }

  const validSubjectPhases = await curriculumApi2023.curriculumPhaseOptions();
  const isValid = isValidSubjectPhaseSlug(validSubjectPhases, slugs);

  if (!isValid) {
    const redirectParams = getKs4RedirectSlug(validSubjectPhases, slugs);
    if (redirectParams) {
      const { subjectSlug, phaseSlug, ks4OptionSlug } = redirectParams;

      return redirect(
        `/programmes/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}`,
        RedirectType.replace,
      );
    } else {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }
  }

  const programmeUnitsData = await curriculumApi2023.curriculumOverview({
    subjectSlug: slugs.subjectSlug,
    phaseSlug: slugs.phaseSlug,
  });
  const curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
    previewMode: false, // TODO: [integrated-journey] preview mode
    subjectTitle: programmeUnitsData.subjectTitle,
    phaseSlug: slugs.phaseSlug,
  });

  if (!curriculumOverviewSanityData) {
    return notFound();
  }

  const curriculumUnitsData = await curriculumApi2023.curriculumSequence(slugs);
  // Sort the units to have examboard versions first - this is so non-examboard units are removed
  // in the visualiser

  curriculumUnitsData.units.sort((a) => {
    if (a.examboard) {
      return -1;
    }
    return 1;
  });

  // Sort by unit order
  curriculumUnitsData.units.sort((a, b) => a.order - b.order);

  const curriculumUnitsFormattedData =
    formatCurriculumUnitsData(curriculumUnitsData);

  const mvRefreshTime = await getMvRefreshTime();
  const curriculumDownloadsTabData = createDownloadsData(
    curriculumUnitsData.units,
  );

  const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

  // TODO: [integrated-journey] isr
  const results = {
    curriculumSelectionSlugs: slugs,
    curriculumPhaseOptions,
    curriculumUnitsData,
    curriculumOverviewSanityData,
    curriculumUnitsFormattedData,
    mvRefreshTime,
    curriculumDownloadsTabData,
  };

  console.log({ results });

  return (
    <div>
      <h1>{subjectPhaseSlug}</h1>
    </div>
  );
};

export default ProgrammePage;
