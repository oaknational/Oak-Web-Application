import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { resolveOakHref } from "@/common-lib/urls";

export type LessonListingPageProps = {
  curriculumData: {
    browseData: LessonListingBrowseData;
  };
};

const PupilLessonListingPage = ({ curriculumData }: LessonListingPageProps) => {
  const { browseData } = curriculumData;
  const unitData = browseData[0]?.unitData;
  const programmeFields = browseData[0]?.programmeFields;

  return (
    <div>
      <h1>{unitData?.title}</h1>
      <h2>{programmeFields?.subject}</h2>
      <h3>{programmeFields?.yearDescription}</h3>
      <ul>
        {browseData.map((lesson) => {
          const lessonData = lesson.lessonData;
          return (
            <li key={lesson.lessonSlug}>
              <a
                href={resolveOakHref({
                  page: "pupil-lesson",
                  lessonSlug: lesson.lessonSlug,
                  programmeSlug: lesson.programmeSlug,
                  unitSlug: lesson.unitSlug,
                })}
              >
                {lessonData?.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export type URLParams = {
  programmeSlug: string;
  unitSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
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
