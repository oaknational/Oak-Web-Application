import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import Button from "../Button";
import OakError from "../../errors/OakError";
import errorHandler from "../../common-lib/error-handler";
import { TrackFn } from "../../context/Analytics/AnalyticsProvider";
import theme from "../../styles/theme";

const reportError = errorHandler("VideoPlayer.tsx");
const INITIAL_DEBUG = false;
const INITIAL_MUTED = false;
const INITIAL_ENV_KEY = process.env.MUX_ENVIRONMENT_KEY;

export type VideoStyleConfig = {
  controls: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

type VideoPlayerProps = {
  playbackId: string;
  title: string;
  track?: TrackFn;
};

const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const { playbackId, title } = props;
  const mediaElRef = useRef<MuxPlayerElement>(null);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [paused, setPaused] = useState<boolean | undefined>(false);
  const [muted, setMuted] = useState(INITIAL_MUTED);
  const [debug] = useState(INITIAL_DEBUG);

  const metadata = {
    "metadata-video-id": playbackId,
    "metadata-video-title": title,
    // do we want to track here using user id here?
    // "metadata-viewer-user-id": userId
  };

  const onError = (evt: Event) => {
    const originalError = evt instanceof CustomEvent ? evt.detail : evt;
    const error = new OakError({
      code: "video/unknown",
      originalError,
      meta: metadata,
    });
    reportError(error, { severity: "error" });
  };

  const playButtonLabel = paused ? "play" : "pause";
  const muteButtonLabel = muted ? "unmute" : "mute";

  return (
    <Flex flexDirection={"column"}>
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
        primaryColor={theme.video.controls.primary}
        secondaryColor={theme.video.controls.secondary}
        tertiaryColor={theme.video.controls.tertiary}
        onPlay={() => {
          setPaused(false);
          props.track?.("video-played", { playbackId });
        }}
        onPause={() => {
          setPaused(true);
          props.track?.("video-paused", { playbackId });
        }}
        onResize={() => {
          props.track?.("video-resized", { playbackId });
        }}
        onError={(evt: Event) => {
          onError(evt);
        }}
      />
      <Flex mt={[16]}>
        <Button
          label={playButtonLabel}
          onClick={() => {
            setPaused(!paused);
          }}
        >
          {playButtonLabel}
        </Button>
        <Button
          ml={[16]}
          label={muteButtonLabel}
          onClick={() => {
            setMuted(!muted);
          }}
        >
          {muteButtonLabel}
        </Button>
      </Flex>
    </Flex>
  );
};

export default VideoPlayer;
