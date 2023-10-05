import { getFileFromBucket } from "@/node-lib/gCloudStorage";
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

export const formatSentences = (sentences: Array<string>): Array<string> => {
  // The sentences retrieved may be split in the middle and put onto multiple lines, this roughly puts them back together
  // with a crude hack to ignore full stops following Mr or Mrs
  const joined = sentences.join(" ");
  const splitOnFullStop = joined.split(/(?<!Mr|Mrs|Ms)\./gi);

  return splitOnFullStop
    .filter((sentence) => sentence.length > 0)
    .map((sentence) => `${sentence.trim()}.`);
};

export const removeWebVttCharacters = (
  sentences: Array<string>,
): Array<string> => {
  // The opening sentence of the vtt file is wrapped in <v ->> </v>
  // I'm not sure why but we want to remove it
  const sentence1 = sentences[0]!.replace("<v ->", "").replace("</v>", "");
  return [sentence1, ...sentences.slice(1)];
};

export const getTextFromCues = (cueList: Cue[]): Array<string> => {
  return Object.values(cueList).map((cue) => cue.text);
};
