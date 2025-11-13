import OakError from "@/errors/OakError";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  formatCurriculumUnitsData,
  createDownloadsData,
  fetchSubjectPhasePickerData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/downloads/getMvRefreshTime";
import {
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";
import { CurriculumVisualiser } from "./CurriculumVisualiser";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) {
  const { subjectPhaseSlug } = await params;

  const slugs = parseSubjectPhaseSlug(subjectPhaseSlug);
  if (!slugs) {
    throw new OakError({
      code: "curriculum-api/params-incorrect",
    });
  }

  const validSubjectPhases = await curriculumApi2023.curriculumPhaseOptions();

  const isValid = isValidSubjectPhaseSlug(validSubjectPhases, slugs);

  if (!isValid) {
    const redirect = getKs4RedirectSlug(validSubjectPhases, slugs);
    if (redirect) {
      const { subjectSlug, phaseSlug, ks4OptionSlug } = redirect;
      return {
        redirect: {
          destination: `/teachers/curriculum/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}`, // TODO: tab
          permanent: false,
        },
      };
    } else {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }
  }

  const curriculumOverviewTabData = await curriculumApi2023.curriculumOverview({
    subjectSlug: slugs.subjectSlug,
    phaseSlug: slugs.phaseSlug,
  });
  const curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
    previewMode: false, // TODO: preview mode
    ...{
      subjectTitle: curriculumOverviewTabData.subjectTitle,
      phaseSlug: slugs.phaseSlug,
    },
  });

  if (!curriculumOverviewSanityData) {
    return {
      notFound: true,
    };
  }

  const curriculumUnitsTabData =
    await curriculumApi2023.curriculumSequence(slugs);

  // Sort the units to have examboard versions first - this is so non-examboard units are removed
  // in the visualiser
  curriculumUnitsTabData.units.sort((a) => {
    if (a.examboard) {
      return -1;
    }
    return 1;
  });

  // Sort by unit order
  curriculumUnitsTabData.units.sort((a, b) => a.order - b.order);

  const curriculumUnitsFormattedData = formatCurriculumUnitsData(
    curriculumUnitsTabData,
  );

  const mvRefreshTime = await getMvRefreshTime();
  const curriculumDownloadsTabData = createDownloadsData(
    curriculumUnitsTabData.units,
  );

  const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

  // TODO: isr
  const results = {
    curriculumSelectionSlugs: slugs,
    curriculumPhaseOptions,
    curriculumOverviewTabData,
    curriculumOverviewSanityData,
    curriculumUnitsFormattedData,
    mvRefreshTime,
    curriculumDownloadsTabData,
  };

  return <CurriculumVisualiser {...results} />;
}
