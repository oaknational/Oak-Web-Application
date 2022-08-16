import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import OakError from "../../errors/OakError";
import theme, { OakColorName } from "../../styles/theme";
import errorReporter from "../../common-lib/error-reporter";

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
  title: string;
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const { playbackId, title } = props;
  const mediaElRef = useRef<MuxPlayerElement>(null);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [paused, setPaused] = useState<boolean | undefined>(true);
  const [muted] = useState(INITIAL_MUTED);
  const [debug] = useState(INITIAL_DEBUG);

  const metadata = {
    "metadata-video-id": playbackId,
    "metadata-video-title": title,
    // do we want to track here using user id here?
    // "metadata-viewer-user-id": userId
  };

  const reportError = errorReporter("VideoPlayer.tsx");

  const onError = (evt: Event) => {
    const originalError = evt instanceof CustomEvent ? evt.detail : evt;
    const error = new OakError({
      code: "video/unknown",
      originalError,
      meta: metadata,
    });
    reportError(error);
  };

  return (
    <Flex $flexDirection={"column"}>
      <MuxPlayer
        ref={mediaElRef}
        // style={{ aspectRatio: "16 / 9" }}
        envKey={envKey}
        metadata={metadata}
        playbackId={playbackId}
        customDomain={"video.thenational.academy"}
        // forwardSeekOffset={10}
        // backwardSeekOffset={10}
        onPlayerReady={() => console.log("ready!")}
        debug={debug}
        muted={muted}
        paused={paused}
        // autoPlay
        primaryColor={theme.colors.white}
        secondaryColor={theme.colors.black}
        onPlay={() => {
          setPaused(false);
          // props.track?.("video-played", { playbackId });
        }}
        onPause={() => {
          setPaused(true);
          // props.track?.("video-paused", { playbackId });
        }}
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
