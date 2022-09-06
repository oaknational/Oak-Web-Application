import React, { FC, useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import OakError from "../../errors/OakError";
import theme, { OakColorName } from "../../styles/theme";
import errorReporter from "../../common-lib/error-reporter";

import useVideoTracking from "./useVideoTracking";
import getTimeElapsed from "./getTimeElapsed";
import getSubtitleTrack from "./getSubtitleTrack";

const INITIAL_DEBUG = false;
const INITIAL_MUTED = false;
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
  const [paused, setPaused] = useState<boolean>(true);
  const [muted] = useState(INITIAL_MUTED);
  const [duration, setDuration] = useState<number | null>(null);
  const [captioned, setCaptioned] = useState<boolean | null>(null);
  const [debug] = useState(INITIAL_DEBUG);

  const videoTracking = useVideoTracking({
    video: {
      duration,
      captioned,
    },
    state: {
      muted,
      timeElapsed: getTimeElapsed(mediaElRef),
    },
  });

  useEffect(() => {
    if (mediaElRef.current) {
      const subtitleTrack = getSubtitleTrack(mediaElRef);
      if (subtitleTrack) {
        setCaptioned(true);
      } else {
        setCaptioned(false);
      }

      const duration = mediaElRef.current.duration;
      if (duration) {
        return setDuration(Math.floor(duration));
      } else {
        //  duration undefined or NaN or 0
      }
    }
  }, [mediaElRef]);

  const metadata = {
    "metadata-video-id": playbackId,
    "metadata-video-title": title,
    // do we want to track here using user id here?
    // "metadata-viewer-user-id": userId
  };

  const reportError = errorReporter("VideoPlayer.tsx");

  const onPlay = () => {
    videoTracking.onPlay();
    setPaused(false);
  };

  const onPause = () => {
    videoTracking.onPause();
    setPaused(true);
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
        // style={{ aspectRatio: "16 / 9" }}
        envKey={envKey}
        metadata={metadata}
        playbackId={playbackId}
        thumbnailTime={thumbTime || undefined}
        customDomain={"video.thenational.academy"}
        // forwardSeekOffset={10}
        // backwardSeekOffset={10}
        onPlayerReady={(video) => {
          console.log(">>>>>>>.", video);
          // debug
        }}
        debug={debug}
        muted={muted}
        paused={paused}
        // autoPlay
        primaryColor={theme.colors.white}
        secondaryColor={theme.colors.black}
        onPlay={onPlay}
        onPause={onPause}
        onResize={() => {
          // props.track?.("video-resized", { playbackId });
        }}
        onError={(evt: Event) => {
          onError(evt);
        }}
      />
    </Flex>
  );
};

export default VideoPlayer;
