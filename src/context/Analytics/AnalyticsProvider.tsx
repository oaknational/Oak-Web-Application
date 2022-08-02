import { createContext, FC, useCallback } from "react";

import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import usePosthog from "../../browser-lib/posthog/usePosthog";

type TrackingEvents = {
  "test-event": { testProperty: string };
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
  const posthogEnabled = useHasConsentedTo("posthog");

  const posthog = usePosthog({ enabled: posthogEnabled });

  const track: TrackFn = useCallback(
    (...args) => {
      if (posthogEnabled) {
        posthog.capture(...args);
      }
    },
    [posthog, posthogEnabled]
  );

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
