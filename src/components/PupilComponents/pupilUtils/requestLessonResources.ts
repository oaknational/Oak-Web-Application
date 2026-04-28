import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { formatSentences, getCaptionsFromFile } from "@/utils/handleTranscript";

const getFormattedTranscriptSentences = (
  transcriptSentences: LessonContent["transcriptSentences"],
): string[] | null => {
  if (!transcriptSentences) {
    return null;
  }

  if (Array.isArray(transcriptSentences)) {
    return formatSentences(transcriptSentences);
  }

  const splitTranscript = transcriptSentences.split(/\r?\n/);
  return formatSentences(splitTranscript);
};

export const requestLessonResources = async ({
  lessonContent,
}: {
  lessonContent: LessonContent;
}) => {
  // For new content we need to fetch the captions file from gCloud and parse the result to generate
  // the transcript sentences.

  const mvTranscriptSentences = getFormattedTranscriptSentences(
    lessonContent.transcriptSentences,
  );
  if (mvTranscriptSentences) {
    return mvTranscriptSentences;
  }

  if (lessonContent.videoTitle && !lessonContent.isLegacy) {
    return getCaptionsFromFile(`${lessonContent.videoTitle}.vtt`);
  }

  return [];
};
