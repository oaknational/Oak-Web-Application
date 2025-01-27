import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { getFileFromBucket } from "@/utils/gCloudStorage";
import { Cue, WebVTTParser } from "webvtt-parser";

export const getCaptionsFromFile = async (fileName: string) => {
  // TODO: get bucket name from config?
  const bucketName = "oak-captions-2023-production";
  const file = await getFileFromBucket(bucketName, fileName);
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

export const formatSentences = (
  sentences: Array<string> | string,
): Array<string> => {
  // The sentences retrieved may be split in the middle and put onto multiple lines, this roughly puts them back together
  // with a crude hack to ignore full stops following Mr or Mrs
  // also ignoring full stops before quotation, whuich has the undesired effect of grouping near quotes
  const joined = Array.isArray(sentences) ? sentences.join(" ") : sentences;
  const splitOnFullStop = joined.split(/(?<!Mr|Mrs|Ms)\.(?!")/gi);
  return splitOnFullStop
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => `${sentence.trim()}.`);
};

export const removeWebVttCharacters = (
  sentences: Array<string>,
): Array<string> => {
  // The opening sentence of the vtt file is wrapped in <v ->> </v>
  // I'm not sure why but we want to remove it
  const sentence1 = sentences[0]!
    .replace(/<v\s+[^>]*?>/, "")
    .replace(/<\/v>/, "");

  return [sentence1, ...sentences.slice(1)];
};

export const getTextFromCues = (cueList: Cue[]): Array<string> => {
  return Object.values(cueList).map((cue) => cue.text);
};

export const populateLessonWithTranscript = async (
  lesson: LessonOverviewPageData,
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
): Promise<MediaClipListCamelCase | null> => {
  const populatedMediaClip = {} as MediaClipListCamelCase;
  for (const cycle in mediaClips) {
    const cycleClips = mediaClips[cycle];
    if (!cycleClips) return null;

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
