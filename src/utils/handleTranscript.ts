import { Cue, WebVTTParser } from "webvtt-parser";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { getFileFromBucket } from "@/utils/gCloudStorage";
import { formatSentences } from "@/utils/formatTranscriptSentences";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

const CAPTIONS_BUCKET_NAME = "oak-captions-2023-production";

const getCachedCaptionFile = cache(
  async (bucketName: string, fileName: string) => {
    "use cache";
    cacheLife("default");
    cacheTag("lesson-caption-file");
    return await getFileFromBucket(bucketName, fileName);
  },
);

export const getCaptionsFromFile = async (fileName: string) => {
  const file = await getCachedCaptionFile(CAPTIONS_BUCKET_NAME, fileName);
  if (file) {
    const parser = new WebVTTParser();

    const tree = parser.parse(file, "metadata");

    if (tree.errors.length) {
      console.error(
        `Error parsing captions file: ${fileName}, errors: ${JSON.stringify(
          tree.errors,
        )}`,
      );
      return;
    }

    const transcript = getTextFromCues(tree.cues);
    return formatSentences(removeWebVttCharacters(transcript));
  }
};

export const removeWebVttCharacters = (
  sentences: Array<string>,
): Array<string> => {
  if (!sentences[0]) {
    return [];
  }
  // The opening sentence of the vtt file is wrapped in <v ->> </v>
  // Some <v> tags have data enclosed,i.e. <v Instructor> this allows removal of the v tag in full
  // I'm not sure why but we want to remove it
  let sentence1 = sentences[0];
  const startTagEnd = sentence1.indexOf(">") + 1;
  if (startTagEnd > 0) {
    sentence1 = sentence1.substring(startTagEnd);
  }
  sentence1 = sentence1.replace("</v>", "");

  return [sentence1, ...sentences.slice(1)];
};

export const getTextFromCues = (cueList: Cue[]): Array<string> => {
  return Object.values(cueList).map((cue) => cue.text);
};

export const populateLessonWithTranscript = async (
  lesson: TeachersLessonOverviewPageData,
) => {
  const { videoTitle, transcriptSentences } = lesson;
  if (videoTitle && !transcriptSentences) {
    // For new content we need to fetch the captions file from gCloud and parse the result to generate
    // the transcript sentences.
    const fileName = `${videoTitle}.vtt`;
    const transcript = await getCaptionsFromFile(fileName);
    if (transcript) {
      lesson.transcriptSentences = transcript;
    }
  } else if (transcriptSentences && !Array.isArray(transcriptSentences)) {
    const splitTranscript = transcriptSentences.split(/\r?\n/);
    const formattedTranscript = formatSentences(splitTranscript);

    lesson.transcriptSentences = formattedTranscript;
  }
  return lesson;
};

export const extractIdFromUrl = (url: string): string => {
  const segments = url.split("/");
  const lastSegment = segments[segments.length - 1];
  const id = lastSegment?.split(".")[0];
  return id ?? "";
};

export const populateMediaClipsWithTranscripts = async (
  mediaClips: MediaClipListCamelCase,
): Promise<MediaClipListCamelCase> => {
  const populatedMediaClip: MediaClipListCamelCase = {};
  for (const [cycle, cycleClips] of Object.entries(mediaClips)) {
    const populateMediaClip = cycleClips.map(async (mediaClip) => {
      const id = extractIdFromUrl(mediaClip?.mediaObject?.url ?? "");
      const transcriptSentences = await getCaptionsFromFile(`${id}.vtt`);

      return { ...mediaClip, transcriptSentences: transcriptSentences ?? null };
    });

    const populatedClips = await Promise.all(populateMediaClip);
    populatedMediaClip[cycle] = populatedClips;
  }
  return populatedMediaClip;
};
