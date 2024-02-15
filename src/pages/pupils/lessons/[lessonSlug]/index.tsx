import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getCaptionsFromFile } from "@/utils/handleTranscript";
import getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import {
  PupilExperienceView,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";

/**
 * Test URLs:
 *
 * Non-published legacy lesson - should result in 404:
 * http://localhost:3000/pupils/lessons/what-is-video-c4v68d
 *
 * Published legacy lesson:
 * http://localhost:3000/pupils/lessons/myths-and-folktales-6cwk0c
 *
 * Published lesson:
 * http://localhost:3000/pupils/lessons/transverse-waves
 *
 *
 */

const PupilsCanonicalPage: NextPage<PupilExperienceViewProps> = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}) => {
  return (
    <PupilExperienceView
      curriculumData={curriculumData}
      hasWorksheet={hasWorksheet}
      backUrl={backUrl}
    />
  );
};

type PupilCanonicalPageURLParams = {
  lessonSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilCanonicalPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview-legacy-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.pupilLessonOverviewCanonical({
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      // For new content we need to fetch the captions file from gCloud and parse the result to generate
      // the transcript sentences.
      const resolveTranscriptSentences = (() => {
        if (curriculumData.videoTitle && !curriculumData.isLegacy) {
          return getCaptionsFromFile(`${curriculumData.videoTitle}.vtt`);
        }

        return curriculumData.transcriptSentences;
      })();

      // Resolve the requests for the transcript and worksheet existence in parallel
      const [transcriptSentences, downloadExistence] = await Promise.all([
        resolveTranscriptSentences,
        curriculumData.isLegacy
          ? { resources: [] }
          : getDownloadResourcesExistence(
              lessonSlug,
              "worksheet-pdf",
              curriculumData.isLegacy,
            ),
      ]);

      const results: GetStaticPropsResult<PupilExperienceViewProps> = {
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

export default PupilsCanonicalPage;
