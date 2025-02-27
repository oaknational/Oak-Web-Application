import { useEffect } from "react";
import useSWR, { SWRConfiguration } from "swr";

import getSignedVideoToken from "./getSignedVideoToken";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { isJwtExpiring } from "@/utils/jwtExpiry";

const reportError = errorReporter("useSignedPlaybackId");
export const apiEndpoint = "/api/video/signed-url";

export const options: SWRConfiguration = {
  revalidateOnFocus: false,
  refreshWhenHidden: true,
  refreshInterval: () => {
    const tokenDuration = 6 * 60 * 60 * 1000; // Signed tokens are valid for 6 hours
    const refreshBuffer = 30 * 60 * 1000; // Refresh the token 30 minutes before it expires
    return tokenDuration - refreshBuffer;
  },
};

export type PlaybackPolicy = "public" | "signed";

type UseSignedPlaybackIdProps = {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  isLegacy: boolean;
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
  isLegacy,
}: UseSignedPlaybackIdProps & {
  type: string;
}): UseSignedPlaybackIdReturnProps => {
  const url =
    playbackPolicy === "signed"
      ? `${apiEndpoint}?id=${playbackId}&type=${type}${
          isLegacy ? "&legacy=true" : ""
        }`
      : null;

  const { data, error, mutate } = useSWR(url, getSignedVideoToken, options);

  const token = data ? JSON.parse(data).token : undefined;

  useEffect(() => {
    if (data && !token) {
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
  }, [data, token, playbackId, playbackPolicy]);

  useEffect(() => {
    if (!token || playbackPolicy !== "signed") return;

    const REFRESH_THRESHOLD = 30 * 60; // Refresh token if it expires in less than 30 minutes
    const CHECK_INTERVAL = 60 * 1000; // Check every 60 seconds

    // Function to check and refresh token if needed
    const checkAndRefreshToken = () => {
      if (isJwtExpiring(token, REFRESH_THRESHOLD)) {
        mutate();
      }
    };

    // Set up periodic checking
    const intervalId = setInterval(checkAndRefreshToken, CHECK_INTERVAL);

    // Handle visibility change (wake from sleep)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndRefreshToken();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", checkAndRefreshToken);
    window.addEventListener("online", checkAndRefreshToken);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkAndRefreshToken);
      window.removeEventListener("online", checkAndRefreshToken);
    };
  }, [token, playbackPolicy, mutate]);

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
  isLegacy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({ playbackId, playbackPolicy, type: "video", isLegacy });

export const useSignedThumbnailToken = ({
  playbackId,
  playbackPolicy,
  isLegacy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({
    playbackId,
    playbackPolicy,
    type: "thumbnail",
    isLegacy,
  });

export const useSignedStoryboardToken = ({
  playbackId,
  playbackPolicy,
  isLegacy,
}: UseSignedPlaybackIdProps) =>
  useSignedMuxToken({
    playbackId,
    playbackPolicy,
    type: "storyboard",
    isLegacy,
  });
