import { GetStaticProps, GetStaticPropsResult } from "next";
import Link from "next/link";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { resolveOakHref } from "@/common-lib/urls";
import { URLParams } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";

export { getStaticPaths } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";

export type LessonListingPageProps = {
  curriculumData: LessonListingBrowseData;
};

const PupilLessonListingPage = ({ curriculumData }: LessonListingPageProps) => {
  const unitData = curriculumData[0]?.unitData;
  const programmeFields = curriculumData[0]?.programmeFields;

  const orderedCurriculumData = curriculumData.sort((a, b) => {
    const aLessonOrder = a.supplementaryData?.orderInUnit ?? 0;
    const bLessonOrder = b.supplementaryData?.orderInUnit ?? 0;
    return aLessonOrder - bLessonOrder;
  });

  console.log("curriculumData", curriculumData);
  return (
    <div>
      <h1>{unitData?.title}</h1>
      <h2>{programmeFields?.subject}</h2>
      <h3>{programmeFields?.yearDescription}</h3>
      <ol>
        {orderedCurriculumData.map((lesson) => {
          const lessonData = lesson.lessonData;
          return (
            <li key={lesson.lessonSlug}>
              <Link
                href={resolveOakHref({
                  page: "pupil-lesson",
                  lessonSlug: lesson.lessonSlug,
                  programmeSlug: lesson.programmeSlug,
                  unitSlug: lesson.unitSlug,
                })}
              >
                {lessonData?.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  LessonListingPageProps,
  URLParams
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
