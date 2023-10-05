import { getFileFromBucket } from "@/node-lib/gCloudStorage";
import { Cue, WebVTTParser } from "webvtt-parser";

export const getCaptionsFile = async (fileName: string) => {
  // TODO: get bucket name from config?
  const bucketName = "oak-captions-2023-production";
  const file = await getFileFromBucket(bucketName, fileName);
  if (file) {
    const parser = new WebVTTParser();
    const tree = parser.parse(file, "metadata");

    // TODO: handle error
    const transcript = getTextFromCues(tree.cues);
    console.log("diego transcript", transcript);
    return transcript;
  }
};

export const getTextFromCues = (cueList: Cue[]): Array<string> => {
  return Object.values(cueList).map((cue) => cue.text);
};
