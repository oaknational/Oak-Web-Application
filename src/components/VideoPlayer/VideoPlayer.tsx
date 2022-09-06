import React, { FC, RefObject, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import OakError from "../../errors/OakError";
import theme, { OakColorName } from "../../styles/theme";
import errorReporter from "../../common-lib/error-reporter";

import useVideoTracking from "./useVideoTracking";
import getTimeElapsed from "./getTimeElapsed";
import getSubtitleTrack from "./getSubtitleTrack";

const getDuration = (ref: RefObject<MuxPlayerElement>) => {
  const duration = ref.current?.duration;
  if (typeof duration === "number" && !isNaN(duration)) {
    return Math.floor(duration);
  }

  return null;
};

const INITIAL_DEBUG = false;
const INITIAL_ENV_KEY = process.env.MUX_ENVIRONMENT_KEY;

export type VideoStyleConfig = {
  controls: {
    primary: OakColorName;
    secondary: OakColorName;
    tertiary: OakColorName;
  };
};

type VideoPlayerProps = {
  playbackId: string;
  thumbnailTime?: number | null;
  title: string;
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const { playbackId, thumbnailTime: thumbTime, title } = props;
  const mediaElRef = useRef<MuxPlayerElement>(null);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [debug] = useState(INITIAL_DEBUG);
  const duration = getDuration(mediaElRef);
  const captioned = Boolean(getSubtitleTrack(mediaElRef));
  const timeElapsed = getTimeElapsed(mediaElRef);

  const trackingProps = {
    video: {
      duration,
      captioned,
      playbackId,
      title,
    },
    state: {
      timeElapsed,
    },
  };
  const videoTracking = useVideoTracking(trackingProps);

  const metadata = {
    "metadata-video-id": playbackId,
    "metadata-video-title": title,
    // do we want to track here using user id here?
    // "metadata-viewer-user-id": userId
  };

  const reportError = errorReporter("VideoPlayer.tsx");

  const onPlay = () => {
    videoTracking.onPlay();
  };

  const onPause = () => {
    videoTracking.onPause();
  };

  const onEnded = () => {
    videoTracking.onEnd();
  };
  const onError = (evt: Event) => {
    const originalError = evt instanceof CustomEvent ? evt.detail : evt;
    const error = new OakError({
      code: "video/unknown",
      originalError,
      meta: metadata,
    });
    reportError(error);
  };

  if (process.env.NODE_ENV === "test") {
    /**
     * @todo add mocked video player or tests for video player
     */
    return null;
  }
  return (
    <Flex $flexDirection={"column"}>
      <MuxPlayer
        streamType="on-demand"
        ref={mediaElRef}
        envKey={envKey}
        metadata={metadata}
        playbackId={playbackId}
        thumbnailTime={thumbTime || undefined}
        customDomain={"video.thenational.academy"}
        debug={debug}
        primaryColor={theme.colors.white}
        secondaryColor={theme.colors.black}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={(evt: Event) => {
          onError(evt);
        }}
        // onDurationChange={(p) => console.log("duration change", p)}
        // onVolumeChange={(p) => console.log("volumn", p)}
        // onLoadedMetadata={(p) => console.log("onLoadedMetadata", p)}
        // onTimeUpdate={(p) => console.log("onTimeUpdate", p)}
      />
    </Flex>
  );
};

export default VideoPlayer;
