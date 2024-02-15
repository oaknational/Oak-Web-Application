import getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import { getCaptionsFromFile } from "@/utils/handleTranscript";

export const requestLessonResources = async ({
  curriculumData,
}: {
  curriculumData: PupilLessonOverviewData;
}) => {
  const { lessonSlug } = curriculumData;

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

  return {
    transcriptSentences,
    hasWorksheet: downloadExistence.resources.some(
      ([type, result]) => type === "worksheet-pdf" && result.exists,
    ),
  };
};
