import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type { Tokens } from "@mux/mux-player";
import MuxPlayerElement from "@mux/mux-player";
import { OakP, OakFlex, OakColorToken } from "@oaknational/oak-components";

import useVideoTracking, { VideoTrackingGetState } from "./useVideoTracking";
import getTimeElapsed from "./getTimeElapsed";
import getSubtitleTrack from "./getSubtitleTrack";
import getDuration from "./getDuration";
import getPercentageElapsed from "./getPercentageElapsed";
import {
  PlaybackPolicy,
  useSignedVideoToken,
  useSignedThumbnailToken,
  useSignedStoryboardToken,
} from "./useSignedVideoToken";

import theme, { OakColorName } from "@/styles/theme";
import errorReporter from "@/common-lib/error-reporter";
import { VideoLocationValueType } from "@/browser-lib/avo/Avo";
import OakError from "@/errors/OakError";
import { PupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const INITIAL_DEBUG = false;
const INITIAL_ENV_KEY = process.env.MUX_ENVIRONMENT_KEY;
const RELOAD_ATTEMPTS = 5;

export type VideoStyleConfig = {
  controls: {
    primary: OakColorName;
    secondary: OakColorName;
    tertiary: OakColorName;
  };
};

export type VideoPlayerProps = {
  playbackId: string;
  playbackPolicy: PlaybackPolicy;
  thumbnailTime?: number | null;
  title: string;
  location: VideoLocationValueType;
  isLegacy: boolean;
  userEventCallback?: (event: VideoEventCallbackArgs) => void;
  pathwayData?: PupilPathwayData;
  isAudioClip?: boolean;
  loadingTextColor?: OakColorToken;
};

export type VideoEventCallbackArgs = {
  event: "play" | "playing" | "pause" | "end";
  timeElapsed: number | null;
  duration: number | null;
  muted: boolean;
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const {
    thumbnailTime: thumbTime,
    title,
    location,
    playbackId,
    playbackPolicy,
    isLegacy,
    userEventCallback = () => {},
    pathwayData,
    isAudioClip,
    loadingTextColor = "black",
  } = props;

  const mediaElRef = useRef<MuxPlayerElement>(null);
  const hasTrackedEndRef = useRef(false);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [debug] = useState(INITIAL_DEBUG);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [reloadOnErrors, setReloadOnErrors] = useState<number[]>([]);

  const getState: VideoTrackingGetState = () => {
    const captioned = Boolean(getSubtitleTrack(mediaElRef));
    const duration = getDuration(mediaElRef);
    const muted = Boolean(mediaElRef.current?.muted);
    const timeElapsed = getTimeElapsed(mediaElRef);

    return {
      captioned,
      duration,
      muted,
      playbackId,
      timeElapsed,
      title,
      location: location,
    };
  };

  const videoTracking = useVideoTracking({ getState, pathwayData });

  const thumbnailToken = useSignedThumbnailToken({
    playbackId,
    playbackPolicy,
    isLegacy,
  });

  const videoToken = useSignedVideoToken({
    playbackId: playbackId,
    playbackPolicy: playbackPolicy,
    isLegacy,
  });

  const storyboardToken = useSignedStoryboardToken({
    playbackId: playbackId,
    playbackPolicy: playbackPolicy,
    isLegacy,
  });

  const metadata = {
    "metadata-video-id": playbackId,
    "metadata-video-title": title,
    // do we want to track here using user id here?
    // "metadata-viewer-user-id": userId
  };

  const reportError = errorReporter("VideoPlayer.tsx");

  const PLAYING_CLASSNAME = "playing";
  const onPlay = () => {
    // This enables the detection of whether or not a video
    // is being played without having to look in the
    // shadow DOM, useful for simple automated test tools
    // and site monitoring synthetics.
    mediaElRef.current?.classList.add(PLAYING_CLASSNAME);
    setVideoIsPlaying(true);
    videoTracking.onPlay();
    userEventCallback({
      event: "play",
      duration: getDuration(mediaElRef),
      timeElapsed: getTimeElapsed(mediaElRef),
      muted: mediaElRef.current?.muted || false,
    });
  };

  const onPause = () => {
    mediaElRef.current?.classList.remove(PLAYING_CLASSNAME);
    setVideoIsPlaying(false);
    videoTracking.onPause();
    userEventCallback({
      event: "pause",
      duration: getDuration(mediaElRef),
      timeElapsed: getTimeElapsed(mediaElRef),
      muted: mediaElRef.current?.muted || false,
    });
  };

  const onTimeUpdate = () => {
    if (getPercentageElapsed(mediaElRef) >= 90 && !hasTrackedEndRef.current) {
      videoTracking.onEnd();
      hasTrackedEndRef.current = true;
      userEventCallback({
        event: "end",
        duration: getDuration(mediaElRef),
        timeElapsed: getTimeElapsed(mediaElRef),
        muted: mediaElRef.current?.muted || false,
      });
    } else if (mediaElRef.current?.classList.contains(PLAYING_CLASSNAME)) {
      userEventCallback({
        event: "playing",
        duration: getDuration(mediaElRef),
        timeElapsed: getTimeElapsed(mediaElRef),
        muted: mediaElRef.current?.muted || false,
      });
    }
  };
  const onError = (evt: Event) => {
    const networkError =
      (evt as CustomEvent).detail?.data?.type === "networkError";
    // Don't report network errors.
    if (networkError) {
      return;
    }

    const newReloadOnErrors = [...reloadOnErrors];
    const prevReloadOnErrorsLength = reloadOnErrors.length;
    if (newReloadOnErrors.length < RELOAD_ATTEMPTS) {
      const timeElapsed = getTimeElapsed(mediaElRef) || 0;
      newReloadOnErrors.push(timeElapsed || 0);
      setReloadOnErrors(newReloadOnErrors);
    }

    const hasMaxAttempts = newReloadOnErrors.length === RELOAD_ATTEMPTS;
    const isFirstAttempt = newReloadOnErrors.length === 1;
    const willReload = prevReloadOnErrorsLength !== newReloadOnErrors.length;
    // Only report the first and last error
    const shouldReport =
      hasMaxAttempts || (willReload && (isFirstAttempt || hasMaxAttempts));

    if (!shouldReport) {
      return;
    }
    const originalError = evt instanceof CustomEvent ? evt.detail : evt;
    const error = new OakError({
      code:
        newReloadOnErrors.length < RELOAD_ATTEMPTS
          ? "video/unknown"
          : "video/persistent-unknown",
      originalError,
      meta: metadata,
    });
    reportError(error, { ...getState() });
  };

  if (videoToken.loading || thumbnailToken.loading || storyboardToken.loading) {
    return (
      <OakFlex
        $alignItems={"center"}
        $justifyContent={"center"}
        $ba={"border-solid-m"}
        $minWidth={"100%"}
        $borderColor={"black"}
        style={{
          aspectRatio: "16/9",
          boxSizing: "content-box",
        }}
      >
        <OakP $color={loadingTextColor} $textAlign="center">
          Loading...
        </OakP>
      </OakFlex>
    );
  }

  const tokens: Tokens = {
    playback: videoToken?.playbackToken ? videoToken.playbackToken : undefined,
    thumbnail: !isAudioClip
      ? thumbnailToken?.playbackToken
        ? thumbnailToken.playbackToken
        : undefined
      : undefined,
    storyboard: storyboardToken?.playbackToken
      ? storyboardToken.playbackToken
      : undefined,
  };

  const reloadingDueToErrors = reloadOnErrors.length > 0;
  let startTime = 0;

  if (reloadingDueToErrors) {
    startTime = reloadOnErrors[reloadOnErrors.length - 1] || 0;
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $ba={"border-solid-l"}
      $minWidth={"100%"}
      $borderColor={"black"}
      style={{
        boxSizing: "content-box",
      }}
    >
      <MuxPlayer
        key={reloadOnErrors.length}
        preload="metadata"
        ref={mediaElRef}
        envKey={envKey}
        metadata={metadata}
        playbackId={playbackId}
        playbackRates={[0.5, 0.7, 1, 1.2, 1.5, 1.7, 2]}
        start-time={startTime}
        tokens={tokens}
        thumbnailTime={thumbTime || undefined}
        customDomain={"video.thenational.academy"}
        beaconCollectionDomain={"mux-litix.thenational.academy"}
        debug={debug}
        primaryColor={theme.colors.white}
        secondaryColor={theme.colors.black}
        accentColor={theme.colors.black}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={() => {
          if (reloadingDueToErrors && videoIsPlaying) {
            mediaElRef.current?.play();
          }
        }}
        style={{
          aspectRatio: "16/9",
          overflow: "hidden",
        }}
      />
    </OakFlex>
  );
};

export default VideoPlayer;
