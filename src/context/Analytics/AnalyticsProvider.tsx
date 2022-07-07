import { createContext, FC, useCallback, useContext } from "react";

import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
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

const analyticsContext = createContext<AnalyticsContext | null>(null);

const useTrackingEnabled = () => {
  const { hasConsentedTo } = useCookieConsent();

  return hasConsentedTo("statistics");
};

export const useAnalytics = () => {
  const analytics = useContext(analyticsContext);

  if (!analytics) {
    throw new Error("useAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

const AnalyticsProvider: FC = (props) => {
  const { children } = props;
  const trackingEnabled = useTrackingEnabled();

  const posthog = usePosthog({ enabled: trackingEnabled });

  const track: TrackFn = useCallback(
    (...args) => {
      posthog.capture(...args);
    },
    [posthog]
  );

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
