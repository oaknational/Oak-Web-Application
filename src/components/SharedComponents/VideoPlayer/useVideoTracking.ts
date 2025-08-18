import { useState } from "react";

import { VideoLocationValueType } from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { PupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const reportError = errorReporter("useVideoTracking");

/**
 * Sends a warning to error monitoring if props are malformed so don't call this every
 * render, instead call it when a track event is called
 * @todo use zod for this
 */
const getEventPropsOrWarn = (props: UseVideoTrackingProps) => {
  const state = props.getState();
  const {
    duration,
    captioned,
    playbackId,
    title,
    timeElapsed,
    muted,
    location,
  } = state;

  if (typeof timeElapsed !== "number") {
    const error = new Error("Could not track video event, props malformed");
    reportError(error, state);
    return;
  }

  return {
    durationSeconds: duration,
    isCaptioned: captioned,
    isMuted: muted,
    timeElapsedSeconds: timeElapsed,
    videoTitle: title,
    videoPlaybackId: [playbackId],
    videoLocation: location,
  };
};

export type VideoTrackingGetState = () => {
  captioned: boolean;
  duration: number | null;
  muted: boolean;
  playbackId: string;
  timeElapsed: number | null;
  title: string;
  location: VideoLocationValueType;
};
type UseVideoTrackingProps = {
  getState: VideoTrackingGetState;
  pathwayData?: PupilPathwayData;
  cloudinaryUrl?: string | null;
  muxAssetId?: string | null;
};
const useVideoTracking = (props: UseVideoTrackingProps) => {
  const { track } = useAnalytics();
  const [started, setStarted] = useState(false);
  const pathwayData = props.pathwayData
    ? props.pathwayData
    : ({} as PupilPathwayData);

  const onPlay = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoPlayed({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl,
      muxAssetId: props.muxAssetId,
    });
    if (!started) {
      track.videoStarted({
        ...eventProps,
        ...pathwayData,
        cloudinaryUrl: props.cloudinaryUrl,
        muxAssetId: props.muxAssetId,
      });
      setStarted(true);
    }
  };
  const onPause = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoPaused({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl,
      muxAssetId: props.muxAssetId,
    });
  };
  const onEnd = () => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }
    track.videoFinished({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl,
      muxAssetId: props.muxAssetId,
    });
  };

  return {
    onPlay,
    onEnd,
    onPause,
  };
};

export default useVideoTracking;
