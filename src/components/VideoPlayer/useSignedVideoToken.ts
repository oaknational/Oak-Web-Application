import { useEffect } from "react";
import useSWR from "swr";

import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";

import getSignedVideoToken from "./getSignedVideoToken";

const reportError = errorReporter("useSignedPlaybackId");
export const apiEndpoint =
  "https://api.thenational.academy/api/signed-video-token";

export const options = {
  revalidateOnFocus: false,
  dedupingInterval: 6 * 60 * 60 * 1000, // Don't generate a new signedUrl unless the old one has expired
};

export type PlaybackPolicy = "public" | "signed";

type UseSignedPlaybackIdProps = {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
};

type UseSignedPlaybackIdReturnProps = {
  loading: boolean;
  error: Error | null;
  playbackToken: string | null | undefined;
};

export const useSignedMuxToken = ({
  playbackId,
  playbackPolicy,
  type,
}: UseSignedPlaybackIdProps & {
  type: string;
}): UseSignedPlaybackIdReturnProps => {
  const { data, error } = useSWR(
    playbackPolicy === "signed"
      ? `${apiEndpoint}?id=${playbackId}&type=${type}`
      : null,
    getSignedVideoToken,
    options
  );
  const token = data?.token;

  useEffect(() => {
    if (data && !data.token) {
      const error = new OakError({
        code: "video/fetch-signed-token",
        meta: {
          data,
          playbackId,
          playbackPolicy,
        },
      });
      reportError(error);
    }
  }, [data, playbackId, playbackPolicy]);

  if (playbackPolicy === "public") {
    return {
      loading: false,
      error: null,
      playbackToken: null,
    };
  }

  if (error) {
    return {
      loading: false,
      error: error,
      playbackToken: null,
    };
  }

  if (token) {
    return {
      loading: false,
      error: null,
      playbackToken: token,
    };
  }

  return {
    loading: true,
    error: null,
    playbackToken: null,
  };
};

export const useSignedVideoToken = ({
  playbackId,
  playbackPolicy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({ playbackId, playbackPolicy, type: "video" });

export const useSignedThumbnailToken = ({
  playbackId,
  playbackPolicy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({ playbackId, playbackPolicy, type: "thumbnail" });

export const useSignedStoryboardToken = ({
  playbackId,
  playbackPolicy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({ playbackId, playbackPolicy, type: "storyboard" });
