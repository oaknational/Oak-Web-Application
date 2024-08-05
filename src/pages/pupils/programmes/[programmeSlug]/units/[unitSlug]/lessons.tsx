import { GetStaticProps, GetStaticPropsResult } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { PupilViewsLessonListing } from "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view";

type PupilLessonListingURLParams = {
  programmeSlug: string;
  unitSlug: string;
};

export type LessonListingPageProps = {
  browseData: LessonListingBrowseData;
};

const PupilLessonListingPage = ({ browseData }: LessonListingPageProps) => {
  const unitData = browseData[0]?.unitData;
  const programmeFields = browseData[0]?.programmeFields;
  const programmeSlug = browseData[0]?.programmeSlug;

  const orderedBrowseData = browseData.sort((a, b) => {
    const aLessonOrder = a.supplementaryData?.orderInUnit;
    const bLessonOrder = b.supplementaryData?.orderInUnit;
    return aLessonOrder - bLessonOrder;
  });

  if (
    unitData === undefined ||
    programmeFields === undefined ||
    programmeSlug === undefined
  ) {
    throw new Error("unitData or programmeFields is undefined");
  }
  return (
    <PupilViewsLessonListing
      unitData={unitData}
      programmeFields={programmeFields}
      orderedCurriculumData={orderedBrowseData}
      programmeSlug={programmeSlug}
    />
  );
};

export const getStaticPaths =
  getStaticPathsTemplate<PupilLessonListingURLParams>;

export const getStaticProps: GetStaticProps<
  LessonListingPageProps,
  PupilLessonListingURLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug, unitSlug } = context.params;
      if (!programmeSlug || !unitSlug) {
        throw new Error("unexpected context.params");
      }

      const { browseData, backLinkData } =
        await curriculumApi2023.pupilLessonListingQuery({
          programmeSlug,
          unitSlug,
        });

      const filteredBrowseData = browseData.filter(
        (lesson) => !lesson.lessonData.deprecatedFields?.isSensitive,
      );

      if (!filteredBrowseData || filteredBrowseData.length === 0) {
        return {
          notFound: true,
        };
      }

      /**
       *
       * Backlink cases to handle:
       *
       * 1. its a non-legacy programme => programmeSlug
       * 2. legacy programme equivalent in the backLinkData => nonLegacyProgrammeSlug
       * 3. legacy programme not in the backLinkData & backLinkData has multiple entries => baseSlug/options
       * 4. legacy programme not in the backLinkData & backLinkData has a single entry => nonLegacyProgrammeSlug
       *
       */

      const backLink = (() => {
        const baseSlug = programmeSlug.match(/.*?year-\d{1,2}/)?.[0];
        const nonLegacyProgrammeSlug = programmeSlug.replace(/-l$/, "");
        const backLinkEquivalent = backLinkData.find(
          (b) => b.programmeSlug === nonLegacyProgrammeSlug,
        );

        switch (true) {
          case !programmeSlug.endsWith("-l"):
            return programmeSlug;
          case backLinkEquivalent !== undefined:
            return backLinkEquivalent.programmeSlug;
          case backLinkData.length > 1:
            return `${baseSlug}/options`;
          default:
            return nonLegacyProgrammeSlug;
        }
      })();

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          browseData: filteredBrowseData,
        },
      };
      return results;
    },
  });
};

export default PupilLessonListingPage;
