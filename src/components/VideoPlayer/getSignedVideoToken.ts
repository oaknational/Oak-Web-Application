import OakError from "../../errors/OakError";
import errorReporter from "../../common-lib/error-reporter";

import { PlaybackPolicy } from "./useSignedVideoToken";
const reportError = errorReporter("useSignedPlaybackId");

const getSignedVideoToken = async (
  url: string,
  playbackId: string,
  playbackPolicy: PlaybackPolicy,
) => {
  const res = await fetch(url);

  if (!res.ok) {
    const json = await res.json();

    const error = new OakError({
      code: "video/fetch-signed-token",
      meta: {
        json,
        status: res.status,
        statusText: res.statusText,
        playbackId,
        playbackPolicy,
      },
    });

    reportError(error);
    throw error;
  }
  return res.json();
};

export default getSignedVideoToken;
