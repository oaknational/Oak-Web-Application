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

export type LessonMediaClipsPageProps = {
  curriculumData: LessonMediaClipsData;
};

export const LessonMediaClipsPage: NextPage<LessonMediaClipsPageProps> = ({
  curriculumData,
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
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            programmeSlug
          }/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
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

      const curriculumData =
        await curriculumApi2023.lessonMediaClips<LessonMediaClipsData>({
          lessonSlug,
          programmeSlug,
          unitSlug,
        });

      if (!curriculumData || !curriculumData.mediaClips) {
        return {
          notFound: true,
        };
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

      const results: GetStaticPropsResult<LessonMediaClipsPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonMediaClipsPage;
