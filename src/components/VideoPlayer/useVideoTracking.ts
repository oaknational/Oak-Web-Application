import { useState } from "react";

import errorReporter from "../../common-lib/error-reporter";
import useAnalytics from "../../context/Analytics/useAnalytics";

const reportError = errorReporter("useVideoTracking");

/**
 * Sends a warning to bugsnag if props are malformed so don't call this every
 * render, instead call it when a track event is called
 * @todo use zod for this
 */
const getEventPropsOrWarn = (props: UseVideoTrackingProps) => {
  const { video, getState } = props;
  const { duration, captioned, playbackId, title } = video;
  const { timeElapsed, muted } = getState();
  if (
    typeof duration !== "number" ||
    typeof captioned !== "boolean" ||
    typeof timeElapsed !== "number"
  ) {
    const error = new Error("Could not track video event, props malformed");
    reportError(error, props);
    return;
  }

  return {
    // @todo duration is NaN on first play, speaking with mux about this
    durationSeconds: duration || 0,
    isCaptioned: captioned,
    // @todo muted and timeElapsed is not currently working
    isMuted: muted,
    timeElapsedSeconds: timeElapsed,
    videoTitle: playbackId,
    videoPlaybackId: title,
  };
};

type UseVideoTrackingProps = {
  video: {
    duration: number | null;
    captioned: boolean | null;
    playbackId: string;
    title: string;
  };
  getState: () => {
    muted: boolean | null;
    timeElapsed: number | null;
  };
};
const useVideoTracking = (props: UseVideoTrackingProps) => {
  const { track } = useAnalytics();
  const [started, setStarted] = useState(false);

  const onPlay = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoPlayed(eventProps);
    if (!started) {
      track.videoStarted(eventProps);
      setStarted(true);
    }
  };
  const onPause = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoPaused(eventProps);
  };
  const onEnd = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoFinished(eventProps);
  };

  return {
    onPlay,
    onEnd,
    onPause,
  };
};

export default useVideoTracking;
