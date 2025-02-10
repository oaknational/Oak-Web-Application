import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  CanonicalLessonMediaClips,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import { CanonicalLessonMediaClipsPageProps } from "@/pages/teachers/lessons/[lessonSlug]/media";
import { populateMediaClipsWithTranscripts } from "@/utils/handleTranscript";

const BetaLessonMediaPage: NextPage<CanonicalLessonMediaClipsPageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, lessonSlug } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Beta Lesson Media: ${lessonTitle} `,
          description: "View beta extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/beta/lessons/${lessonSlug}`,
        }),
      }}
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
    page: "betaLessonMedia::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;
      const curriculumData =
        await curriculumApi2023.betaLessonMediaClipsQuery<CanonicalLessonMediaClips>(
          {
            lessonSlug,
          },
        );

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
      const results: GetStaticPropsResult<CanonicalLessonMediaClipsPageProps> =
        {
          props: {
            curriculumData,
          },
        };
      return results;
    },
  });
};

export default BetaLessonMediaPage;
