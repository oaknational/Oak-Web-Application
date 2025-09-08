import MuxPlayerElement from "@mux/mux-player";

import getDuration from "./getDuration";
import getPercentageElapsed from "./getPercentageElapsed";
import getTimeElapsed from "./getTimeElapsed";
import { VideoEventCallbackArgs } from "./VideoPlayer";

export const onPlay = ({
  mediaElRef,
  setVideoIsPlaying,
  trackOnPlay,
  userEventCallback,
  playingClassname,
}: {
  mediaElRef: React.RefObject<MuxPlayerElement>;
  setVideoIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  trackOnPlay: (isVideoStart: boolean) => void;
  userEventCallback: (args: VideoEventCallbackArgs) => void;
  playingClassname: string;
}) => {
  // This enables the detection of whether or not a video
  // is being played without having to look in the
  // shadow DOM, useful for simple automated test tools
  // and site monitoring synthetics.
  mediaElRef.current?.classList.add(playingClassname);
  setVideoIsPlaying(true);
  const isVideoStart = mediaElRef.current?.currentTime === 0;
  trackOnPlay(isVideoStart);
  userEventCallback({
    event: "play",
    duration: getDuration(mediaElRef),
    timeElapsed: getTimeElapsed(mediaElRef),
    muted: mediaElRef.current?.muted || false,
  });
};

export const onPause = ({
  mediaElRef,
  setVideoIsPlaying,
  trackOnPause,
  userEventCallback,
  playingClassname,
}: {
  mediaElRef: React.RefObject<MuxPlayerElement>;
  setVideoIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  trackOnPause: () => void;
  userEventCallback: (args: VideoEventCallbackArgs) => void;
  playingClassname: string;
}) => {
  mediaElRef.current?.classList.remove(playingClassname);
  setVideoIsPlaying(false);
  const isVideoFinished =
    mediaElRef.current?.currentTime === mediaElRef.current?.duration;
  if (!isVideoFinished) {
    trackOnPause();
    userEventCallback({
      event: "pause",
      duration: getDuration(mediaElRef),
      timeElapsed: getTimeElapsed(mediaElRef),
      muted: mediaElRef.current?.muted || false,
    });
  }
};

export const onTimeUpdate = ({
  mediaElRef,
  setEndTracked,
  trackOnEnd,
  userEventCallback,
  playbackId,
  endTracked,
  playingClassname,
}: {
  mediaElRef: React.RefObject<MuxPlayerElement>;
  setEndTracked: React.Dispatch<React.SetStateAction<string | null>>;
  trackOnEnd: () => void;
  userEventCallback: (args: VideoEventCallbackArgs) => void;
  playbackId: string;
  endTracked: string | null;
  playingClassname: string;
}) => {
  if (getPercentageElapsed(mediaElRef) >= 90 && endTracked !== playbackId) {
    trackOnEnd();
    setEndTracked(playbackId);
    userEventCallback({
      event: "end",
      duration: getDuration(mediaElRef),
      timeElapsed: getTimeElapsed(mediaElRef),
      muted: mediaElRef.current?.muted || false,
    });
  } else if (mediaElRef.current?.classList.contains(playingClassname)) {
    userEventCallback({
      event: "playing",
      duration: getDuration(mediaElRef),
      timeElapsed: getTimeElapsed(mediaElRef),
      muted: mediaElRef.current?.muted || false,
    });
  }
};
