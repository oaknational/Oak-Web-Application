import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { resolveOakHref } from "@/common-lib/urls";
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
} from "@/components/PupilViews/PupilExperience/PupilExperience.view";

/**
 * Test URLs:
 *
 * Non-published lesson:
 * http://localhost:3000/pupils/l/video-editing-7a9a/lessons/what-is-video-c4v68d
 *
 * Published lesson:
 * http://localhost:3000/pupils/l/the-oral-tradition-7424/lessons/myths-and-folktales-6cwk0c
 *
 *
 */

const PupilsLegacyCanonicalPage: NextPage<PupilExperienceViewProps> = ({
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

type PupilLegacyCanonicalPageURLParams = {
  lessonSlug: string;
  redirectFrom: string;
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
  PupilExperienceViewProps,
  PupilLegacyCanonicalPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview-legacy-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, redirectFrom } = context.params;

      const redirectUrl = `${resolveOakHref({
        page: "classroom",
      })}/${redirectFrom}`;

      const curriculumData = await curriculumApi2023
        .pupilLessonOverviewCanonical({
          lessonSlug,
        })
        .catch((error) => {
          console.error("Error fetching pupilLessonOverviewCanonical", {
            lessonSlug,
            error,
          });
          return null;
        });

      if (!curriculumData) {
        return {
          redirect: {
            destination: redirectUrl,
            permanent: false,
          },
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
          backUrl: redirectUrl,
        },
      };

      return results;
    },
  });
};

export default PupilsLegacyCanonicalPage;
