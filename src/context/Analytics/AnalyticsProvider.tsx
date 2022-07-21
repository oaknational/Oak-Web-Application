/*
 * Description: Video player component
 *
 * Uses Mux Video Player
 *
 * https://github.com/muxinc/elements/tree/main/packages/mux-player-react
 *
 */

import { createContext, FC, useCallback } from "react";

import usePosthog from "../../browser-lib/posthog/usePosthog";

import useTrackingEnabled from "./useTrackingEnabled";

type TrackingEvents = {
  "test-event": { testProperty: string };
  "video-played": { playbackId: string };
  "video-paused": { playbackId: string };
  "video-resized": { playbackId: string };
};

type TrackFn = <TrackingEventName extends keyof TrackingEvents>(
  name: TrackingEventName,
  props: TrackingEvents[TrackingEventName]
) => void;
type AnalyticsContext = {
  track: TrackFn;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const AnalyticsProvider: FC = (props) => {
  const { children } = props;
  const trackingEnabled = useTrackingEnabled();

  const posthog = usePosthog({ enabled: trackingEnabled });

  const track: TrackFn = useCallback(
    (...args) => {
      if (trackingEnabled) {
        posthog.capture(...args);
      }
    },
    [posthog, trackingEnabled]
  );

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
