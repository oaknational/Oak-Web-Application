import { VideoLocationValueType } from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { PupilPathwayData } from "@/context/PupilLessonAnalytics/pupilAnalyticsHelpers";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";
import { TeacherBrowseTrackFns } from "@/context/TeacherBrowseAnalytics/teacherBrowseAnalytics.types";

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
  pathwayData?: PupilPathwayData | AnalyticsBrowseData;
  cloudinaryUrl?: string | null;
  muxAssetId?: string | null;
};

export type VideoAnalyticsOverrides = Pick<
  TeacherBrowseTrackFns,
  "videoFinished" | "videoPaused" | "videoPlayed" | "videoStarted"
>;

const useVideoTracking = (
  props: UseVideoTrackingProps & {
    analyticsOverrides?: VideoAnalyticsOverrides;
  },
) => {
  // When all tracking is integrated into the store we can remove this useAnalytics hook fallback and overrides
  const { track } = useAnalytics();
  const trackVideoPlayed =
    props.analyticsOverrides?.videoPlayed ?? track.videoPlayed;
  const trackVideoStarted =
    props.analyticsOverrides?.videoStarted ?? track.videoStarted;
  const trackVideoPaused =
    props.analyticsOverrides?.videoPaused ?? track.videoPaused;
  const trackVideoFinished =
    props.analyticsOverrides?.videoFinished ?? track.videoFinished;
  const journeyId = props.analyticsOverrides ? undefined : null;

  const pathwayData = props.pathwayData
    ? props.pathwayData
    : ({} as PupilPathwayData);

  const onPlay = (isVideoStart: boolean) => {
    const eventProps = getEventPropsOrWarn(props);
    if (!eventProps) {
      return;
    }

    trackVideoPlayed({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl ?? null,
      muxAssetId: props.muxAssetId ?? null,
      journeyId,
    });

    if (isVideoStart) {
      trackVideoStarted({
        ...eventProps,
        ...pathwayData,
        cloudinaryUrl: props.cloudinaryUrl ?? null,
        muxAssetId: props.muxAssetId ?? null,
        journeyId,
      });
    }
  };
  const onPause = () => {
    const eventProps = getEventPropsOrWarn(props);

    if (!eventProps) {
      return;
    }
    trackVideoPaused({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl ?? null,
      muxAssetId: props.muxAssetId ?? null,
      journeyId,
    });
  };
  const onEnd = () => {
    const eventProps = getEventPropsOrWarn(props);

    if (!eventProps) {
      return;
    }
    trackVideoFinished({
      ...eventProps,
      ...pathwayData,
      cloudinaryUrl: props.cloudinaryUrl ?? null,
      muxAssetId: props.muxAssetId ?? null,
      journeyId,
    });
  };

  return {
    onPlay,
    onEnd,
    onPause,
  };
};

export default useVideoTracking;
