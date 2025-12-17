import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonMediaClipsData,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { populateMediaClipsWithTranscripts } from "@/utils/handleTranscript";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type LessonMediaClipsPageProps = {
  curriculumData: LessonMediaClipsData;
  topNav: TopNavProps;
};

export const LessonMediaClipsPage: NextPage<LessonMediaClipsPageProps> = ({
  curriculumData,
  topNav,
}) => {
  const {
    lessonTitle,
    keyStageSlug,
    subjectTitle,
    programmeSlug,
    unitSlug,
    lessonSlug,
  } = curriculumData;
  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            programmeSlug
          }/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
        noIndex: true,
        noFollow: true,
      }}
    >
      <LessonMedia isCanonical={false} lesson={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
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
  LessonMediaClipsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lessonMedia::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, programmeSlug, unitSlug } = context.params;
      let curriculumData;

      try {
        curriculumData =
          await curriculumApi2023.lessonMediaClips<LessonMediaClipsData>({
            lessonSlug,
            programmeSlug,
            unitSlug,
          });
      } catch (innerError) {
        allowNotFoundError(innerError);
      }

      if (!curriculumData || !curriculumData.mediaClips) {
        const redirect = await getRedirect({
          isCanonical: false,
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

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }
      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<LessonMediaClipsPageProps> = {
        props: {
          curriculumData,
          topNav,
        },
      };
      return results;
    },
  });
};

export default LessonMediaClipsPage;
