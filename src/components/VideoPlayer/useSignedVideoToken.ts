import { useEffect } from "react";
import useSWR from "swr";

import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";

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

const useSignedVideoToken = ({
  playbackId,
  playbackPolicy,
}: UseSignedPlaybackIdProps): UseSignedPlaybackIdReturnProps => {
  const fetcher = async (url: string) => {
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

  const { data, error } = useSWR(
    playbackPolicy === "signed"
      ? `${apiEndpoint}?id=${playbackId}&type=video`
      : null,
    fetcher,
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

export default useSignedVideoToken;
