import React, { FC, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import MuxPlayerElement from "@mux/mux-player";

import Flex from "../Flex";
import Button from "../Button";
import OakError from "../../errors/OakError";
import errorHandler from "../../common-lib/error-handler";
import useAnalytics from "../../context/Analytics/useAnalytics";
import theme from "../../styles/theme";

const reportError = errorHandler("VideoPlayer.tsx");
const INITIAL_DEBUG = false;
const INITIAL_MUTED = false;
const INITIAL_ENV_KEY = process.env.MUX_ENVIRONMENT_KEY;

// examples of events we can track
// const onLoadStart = console.log.bind(null, "loadstart");
// const onLoadedMetadata = console.log.bind(null, "loadedmetadata");
// const onProgress = console.log.bind(null, "progress");
// const onDurationChange = console.log.bind(null, "durationchange");
// const onVolumeChange = console.log.bind(null, "volumechange");
// const onRateChange = console.log.bind(null, "ratechange");
// const onResize = console.log.bind(null, "resize");
// const onWaiting = console.log.bind(null, "waiting");
// const onPlaying = console.log.bind(null, "playing");
// const onTimeUpdate = console.log.bind(null, "timeupdate");
// const onEnded = console.log.bind(null, "ended");
// const onPlayerReady = console.log.bind(null, "playerready");

const onPause = console.log.bind(null, "pause");
const onSeeking = console.log.bind(null, "seeking");
const onSeeked = console.log.bind(null, "seeked");

export type VideoStyleConfig = {
  controls: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

type VideoPlayerProps = {
  playbackId: string;
};

const VideoPlayer: FC<VideoPlayerProps> = ({ playbackId }) => {
  const { track } = useAnalytics();
  const mediaElRef = useRef<MuxPlayerElement>(null);
  const [envKey] = useState(INITIAL_ENV_KEY);
  const [paused, setPaused] = useState<boolean | undefined>(false);
  const [muted, setMuted] = useState(INITIAL_MUTED);
  const [debug] = useState(INITIAL_DEBUG);

  const metadata = {
    "metadata-video-id": playbackId,
    // do we want to track here using user id
    // "metadata-viewer-user-id": userId
  };

  const onPlay = () => {
    track("video-played", { playbackId });
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
          onPlay();
          setPaused(false);
        }}
        onPause={(evt: Event) => {
          onPause(evt);
          setPaused(true);
        }}
        onError={(evt: Event) => {
          onError(evt);
        }}
        onSeeking={onSeeking}
        onSeeked={onSeeked}
        // startTime={12}
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
