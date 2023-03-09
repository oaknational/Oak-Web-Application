import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type { Tokens } from "@mux/mux-player";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import OakError from "../../errors/OakError";
import theme, { OakColorName } from "../../styles/theme";
import errorReporter from "../../common-lib/error-reporter";
import { VideoLocationValueType } from "../../browser-lib/avo/Avo";
import { P } from "../Typography";

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

const INITIAL_DEBUG = false;
const INITIAL_ENV_KEY = process.env.MUX_ENVIRONMENT_KEY;

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
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const {
    thumbnailTime: thumbTime,
    title,
    location,
    playbackId,
    playbackPolicy,
  } = props;
  const mediaElRef = useRef<MuxPlayerElement>(null);
  const hasTrackedEndRef = useRef(false);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [debug] = useState(INITIAL_DEBUG);

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

  const videoTracking = useVideoTracking({ getState });

  const thumbnailToken = useSignedThumbnailToken({
    playbackId,
    playbackPolicy,
  });

  const videoToken = useSignedVideoToken({
    playbackId: playbackId,
    playbackPolicy: playbackPolicy,
  });

  const storyboardToken = useSignedStoryboardToken({
    playbackId: playbackId,
    playbackPolicy: playbackPolicy,
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
    videoTracking.onPlay();
  };

  const onPause = () => {
    mediaElRef.current?.classList.remove(PLAYING_CLASSNAME);
    videoTracking.onPause();
  };

  const onTimeUpdate = () => {
    if (getPercentageElapsed(mediaElRef) >= 90 && !hasTrackedEndRef.current) {
      videoTracking.onEnd();
      hasTrackedEndRef.current = true;
    }
  };
  const onError = (evt: Event) => {
    const originalError = evt instanceof CustomEvent ? evt.detail : evt;
    const error = new OakError({
      code: "video/unknown",
      originalError,
      meta: metadata,
    });
    reportError(error, { ...getState() });
  };

  if (process.env.NODE_ENV === "test") {
    /**
     * @todo add mocked video player or tests for video player
     */
    return null;
  }
  if (videoToken.loading || thumbnailToken.loading || storyboardToken.loading) {
    return (
      <Flex $flexDirection={"column"} $width={"100%"}>
        <P $textAlign="center">Loading...</P>
      </Flex>
    );
  }

  const tokens: Tokens = {
    playback: videoToken?.playbackToken ? videoToken.playbackToken : undefined,
    thumbnail: thumbnailToken?.playbackToken
      ? thumbnailToken.playbackToken
      : undefined,
    storyboard: storyboardToken?.playbackToken
      ? storyboardToken.playbackToken
      : undefined,
  };

  return (
    <Flex $flexDirection={"column"} $width={"100%"}>
      <MuxPlayer
        preload="metadata"
        streamType="on-demand"
        ref={mediaElRef}
        envKey={envKey}
        metadata={metadata}
        playbackId={playbackId}
        tokens={tokens}
        thumbnailTime={thumbTime || undefined}
        customDomain={"video.thenational.academy"}
        beaconCollectionDomain={"mux-litix.thenational.academy"}
        debug={debug}
        primaryColor={theme.colors.white}
        secondaryColor={theme.colors.black}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        onTimeUpdate={onTimeUpdate}
        style={{
          aspectRatio: "16/9",
        }}
      />
    </Flex>
  );
};

export default VideoPlayer;
