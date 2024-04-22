import Link from "next/link";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import { OakLink } from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonListingBrowseData,
  PupilUnitData,
} from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
// import OakLink from "@/components/SharedComponents/OwaLink";
import { resolveOakHref } from "@/common-lib/urls";


export type LessonListingPageProps = {
  curriculumData: {
    browseData: LessonListingBrowseData;
    unitData: PupilUnitData;
  };
};

const PupilLessonListingPage = ({ curriculumData }: LessonListingPageProps) => {
  const { browseData, unitData } = curriculumData;
  const { unitTitle, subjectTitle, yearDescription } = unitData;
  return (
    <div>
      <h1>{unitTitle}</h1>
      <h2>{subjectTitle}</h2>
      <h3>{yearDescription}</h3>
      <ul>
        {browseData.map((lesson) => (
          <li key={lesson.lessonSlug}>
            <OakLink
              element={Link}
              href={resolveOakHref({
                page: "pupil-lesson",
                lessonSlug: lesson.lessonSlug,
                programmeSlug: lesson.programmeSlug,
                unitSlug: lesson.unitSlug,
              })}
            >
              {lesson.lessonTitle}
            </OakLink>
          </li>
        ))}
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
