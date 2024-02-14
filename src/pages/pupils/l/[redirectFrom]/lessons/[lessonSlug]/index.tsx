import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

type PupilsLegacyCanonicalPageProps = {};

const PupilsLegacyCanonicalPage: NextPage<
  PupilsLegacyCanonicalPageProps
> = () => {
  return <div>PupilsLegacyCanonicalPage</div>;
};

export type PupilLegacyCanonicalPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilLegacyCanonicalPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilsLegacyCanonicalPageProps,
  PupilLegacyCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      const curriculumData = await curriculumApi2023.pupilLessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      // For new content we need to fetch the captions file from gCloud and parse the result to generate
      // the transcript sentences.
      //   const resolveTranscriptSentences = (() => {
      //     if (curriculumData.videoTitle && !curriculumData.isLegacy) {
      //       return getCaptionsFromFile(`${curriculumData.videoTitle}.vtt`);
      //     }

      //     return curriculumData.transcriptSentences;
      //   })();

      // Resolve the requests for the transcript and worksheet existence in parallel
      //   const [transcriptSentences, downloadExistence] = await Promise.all([
      //     resolveTranscriptSentences,
      //     curriculumData.isLegacy
      //       ? { resources: [] }
      //       : getDownloadResourcesExistence(
      //           lessonSlug,
      //           "worksheet-pdf",
      //           curriculumData.isLegacy,
      //         ),
      //   ]);

      const results: GetStaticPropsResult<PupilLessonOverviewPageProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
            transcriptSentences: transcriptSentences ?? [],
          },
          hasWorksheet: downloadExistence.resources.some(
            ([type, result]) => type === "worksheet-pdf" && result.exists,
          ),
        },
      };

      return results;
    },
  });
};

export default PupilsLegacyCanonicalPage;
