import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonDownloadsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloadsCanonical.schema";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { formatSentences, getCaptionsFromFile } from "@/utils/handleTranscript";

export const requestLessonResources = async ({
  lessonContent,
}: {
  lessonContent: LessonContent;
}) => {
  const { lessonSlug } = lessonContent;

  // For new content we need to fetch the captions file from gCloud and parse the result to generate
  // the transcript sentences.
  const resolveTranscriptSentences = (() => {
    if (lessonContent.videoTitle && !lessonContent.isLegacy) {
      return getCaptionsFromFile(`${lessonContent.videoTitle}.vtt`);
    }

    return formatSentences(lessonContent.transcriptSentences || []);
  })();

  // Resolve the requests for the transcript and worksheet existence in parallel
  const [transcriptSentences, lessonDownloads] = await Promise.all([
    resolveTranscriptSentences,
    curriculumApi2023.lessonDownloads<LessonDownloadsCanonical>({ lessonSlug }),
  ]);

  return {
    transcriptSentences,
    hasWorksheet: lessonDownloads.downloads.some(
      ({ type, exists }) => type === "worksheet-pdf" && exists,
    ),
  };
};
