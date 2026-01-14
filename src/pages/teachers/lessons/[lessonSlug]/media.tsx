import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import {
  CanonicalLessonMediaClips,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { populateMediaClipsWithTranscripts } from "@/utils/handleTranscript";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type CanonicalLessonMediaClipsPageProps = {
  curriculumData: CanonicalLessonMediaClips;
  topNav: TopNavProps;
};

export const CanonicalLessonMediaClipsPage: NextPage<
  CanonicalLessonMediaClipsPageProps
> = ({ curriculumData, topNav }) => {
  const { lessonTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle}`,
          description:
            "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
        }),
        noIndex: true,
        noFollow: true,
      }}
      topNavProps={topNav}
    >
      <LessonMedia isCanonical={true} lesson={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
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
  CanonicalLessonMediaClipsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "share::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      let curriculumData;
      try {
        curriculumData =
          await curriculumApi2023.lessonMediaClips<CanonicalLessonMediaClips>({
            lessonSlug,
          });
      } catch (innerError) {
        allowNotFoundError(innerError);
      }

      if (!curriculumData || !curriculumData.mediaClips) {
        const redirect = await getRedirect({
          isCanonical: true,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      const mediaClipsWithTranscripts = curriculumData.mediaClips
        ? await populateMediaClipsWithTranscripts(curriculumData.mediaClips)
        : [];

      if (mediaClipsWithTranscripts) {
        curriculumData.mediaClips =
          mediaClipsWithTranscripts as MediaClipListCamelCase;
      }

      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<CanonicalLessonMediaClipsPageProps> =
        {
          props: {
            curriculumData,
            topNav,
          },
        };
      return results;
    },
  });
};

export default CanonicalLessonMediaClipsPage;
