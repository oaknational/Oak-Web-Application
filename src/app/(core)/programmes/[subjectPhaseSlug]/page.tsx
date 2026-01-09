import { notFound, redirect, RedirectType } from "next/navigation";

import { useFeatureFlag } from "../../../../utils/featureFlags";

import { ProgrammeView } from "./Components/ProgrammeView";

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
  fetchSubjectPhasePickerData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

// TD: [integrated journey] get revalidate from env somehow
export const revalidate = 7200;

const ProgrammePage = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const isEnabled = await useFeatureFlag(
    "teachers-integrated-journey",
    "boolean",
  );
  try {
    const { subjectPhaseSlug } = await params;

    const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

    if (!subjectPhaseKeystageSlugs || !isEnabled) {
      return notFound();
    }

    const validSubjectPhases = await curriculumApi2023.curriculumPhaseOptions();
    const isValid = isValidSubjectPhaseSlug(
      validSubjectPhases,
      subjectPhaseKeystageSlugs,
    );

    if (!isValid) {
      const redirectParams = getKs4RedirectSlug(
        validSubjectPhases,
        subjectPhaseKeystageSlugs,
      );
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
      subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
      phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
    });
    const curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage(
      {
        previewMode: false, // TD: [integrated-journey] preview mode
        subjectTitle: programmeUnitsData.subjectTitle,
        phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      },
    );

    if (!curriculumOverviewSanityData) {
      return notFound();
    }

    const curriculumUnitsData = await curriculumApi2023.curriculumSequence(
      subjectPhaseKeystageSlugs,
    );
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

    const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

    const results = {
      curriculumSelectionSlugs: subjectPhaseKeystageSlugs,
      curriculumPhaseOptions,
      subjectTitle: programmeUnitsData.subjectTitle,
      curriculumOverviewSanityData,
      curriculumUnitsFormattedData,
    };

    return <ProgrammeView {...results} />;
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }
    // TD: [integrated journey] error reporting
    throw error;
  }
};

export default ProgrammePage;
