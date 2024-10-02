import {
  PupilAnalyticsContext,
  PupilAnalyticsTrack,
  trackingEvents,
} from "./PupilAnalyticsProvider";

export function getMockPupilAnalytics(): PupilAnalyticsContext {
  return {
    track: trackingEvents.reduce((acc, event) => {
      acc[event] = (...args: unknown[]) => {
        console.log(`Mock track method ${event} called with args ${args}`);
      };
      return acc;
    }, {} as PupilAnalyticsTrack),
  };
}
