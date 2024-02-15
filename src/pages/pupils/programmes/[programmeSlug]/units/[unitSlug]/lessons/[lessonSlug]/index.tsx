import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { getCaptionsFromFile } from "@/utils/handleTranscript";
import getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import {
  PupilExperienceView,
  PupilExperienceViewProps,
} from "@/components/PupilViews/PupilExperience";

const PupilsPage: NextPage<PupilExperienceViewProps> = ({
  curriculumData,
  hasWorksheet,
}) => (
  <PupilExperienceView
    curriculumData={curriculumData}
    hasWorksheet={hasWorksheet}
  />
);

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilExperienceViewProps,
  PupilPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupils-lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("context.params is undefined");
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
      const resolveTranscriptSentences = (() => {
        if (curriculumData.videoTitle && !curriculumData.isLegacy) {
          return getCaptionsFromFile(`${curriculumData.videoTitle}.vtt`);
        }

        return curriculumData.transcriptSentences;
      })();

      // Resolve the requests for the transcript and worksheet existence in parallel
      const [transcriptSentences, downloadExistence] = await Promise.all([
        resolveTranscriptSentences,
        getDownloadResourcesExistence(
          lessonSlug,
          "worksheet-pdf",
          curriculumData.isLegacy,
        ).catch((error) => {
          // If the download existence check fails, we should not block the page from rendering
          // there appear to be two ways the `getDownloadResourcesExistence` will report a missing
          // resource. Either by returning an object in the form `{ resources: ["worksheet-pdf", { exists: false }] }`
          // or by throwing. Catching and reporting the error matches the behaviour of the teachers downloads page
          reportError(error);

          return {
            resources: [],
          };
        }),
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

export default PupilsPage;
