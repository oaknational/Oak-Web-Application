import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { formatSentences, getCaptionsFromFile } from "@/utils/handleTranscript";

export const requestLessonResources = async ({
  lessonContent,
}: {
  lessonContent: LessonContent;
}) => {
  // For new content we need to fetch the captions file from gCloud and parse the result to generate
  // the transcript sentences.

  if (lessonContent.videoTitle && !lessonContent.isLegacy) {
    return getCaptionsFromFile(`${lessonContent.videoTitle}.vtt`);
  }

  return formatSentences(lessonContent.transcriptSentences || []);
};
