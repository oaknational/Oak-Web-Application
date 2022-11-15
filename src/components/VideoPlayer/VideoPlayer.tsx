import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import OakError from "../../errors/OakError";
import theme, { OakColorName } from "../../styles/theme";
import errorReporter from "../../common-lib/error-reporter";
import { VideoLocationValueType } from "../../browser-lib/avo/Avo";

import useVideoTracking, { VideoTrackingGetState } from "./useVideoTracking";
import getTimeElapsed from "./getTimeElapsed";
import getSubtitleTrack from "./getSubtitleTrack";
import getDuration from "./getDuration";

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
  thumbnailTime?: number | null;
  title: string;
  location: VideoLocationValueType;
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const { playbackId, thumbnailTime: thumbTime, title, location } = props;
  const mediaElRef = useRef<MuxPlayerElement>(null);
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
    reportError(error, { ...getState() });
  };

  if (process.env.NODE_ENV === "test") {
    /**
     * @todo add mocked video player or tests for video player
     */
    return null;
  }
  return (
    <Flex $flexDirection={"column"} $width={"100%"}>
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
        onError={onError}
        style={{
          aspectRatio: "16/9",
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
