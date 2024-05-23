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
  curriculumData: LessonListingBrowseData;
};

const PupilLessonListingPage = ({ curriculumData }: LessonListingPageProps) => {
  const unitData = curriculumData[0]?.unitData;
  const programmeFields = curriculumData[0]?.programmeFields;
  const programmeSlug = curriculumData[0]?.programmeSlug;

  const orderedCurriculumData = curriculumData.sort((a, b) => {
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
      orderedCurriculumData={orderedCurriculumData}
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

      const curriculumData = await curriculumApi2023.pupilLessonListingQuery({
        programmeSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default PupilLessonListingPage;
