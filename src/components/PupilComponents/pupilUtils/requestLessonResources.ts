import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { formatSentences, getCaptionsFromFile } from "@/utils/handleTranscript";

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

    return formatSentences(curriculumData.transcriptSentences);
  })();

  // Resolve the requests for the transcript and worksheet existence in parallel
  const [transcriptSentences, lessonDownloads] = await Promise.all([
    resolveTranscriptSentences,
    curriculumApi2023.lessonDownloadsCanonical({ lessonSlug }),
  ]);

  return {
    transcriptSentences,
    hasWorksheet: lessonDownloads.downloads.some(
      ({ type, exists }) => type === "worksheet-pdf" && exists,
    ),
  };
};
