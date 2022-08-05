import { createContext, FC, useCallback, useEffect, useMemo } from "react";
import router from "next/router";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import usePosthog from "../../browser-lib/posthog/usePosthog";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import getAnalyticsSDKBridge from "../../browser-lib/avo/getAnalyticsSDKBridge";
import useHubspot from "../../browser-lib/hubspot/useHubspot";

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;
type AnalyticsContext = {
  track: TrackFns;
};

export type EventFn = (
  eventName: string,
  eventProperties: Record<string, unknown>
) => void;
export type PageFn = () => void;
export type IdentifyProperties = { email?: string };
export type IdentifyFn = (
  userId: string,
  userProperties: IdentifyProperties
) => void;

export type AnalyticsService = {
  enabled?: boolean;
  loaded: () => boolean;
  track: EventFn;
  page: PageFn;
  identify: IdentifyFn;
  optOut: () => void;
  optIn: () => void;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const AnalyticsProvider: FC = (props) => {
  const { children } = props;

  const posthogEnabled = useHasConsentedTo("posthog");
  const posthog = usePosthog({ enabled: posthogEnabled });
  useEffect(() => {
    if (posthogEnabled) {
      posthog.optIn();
    } else {
      posthog.optOut();
    }
  }, [posthog, posthogEnabled]);
  const hubspotEnabled = useHasConsentedTo("hubspot");
  const hubspot = useHubspot({ enabled: hubspotEnabled });
  useEffect(() => {
    if (hubspotEnabled) {
      hubspot.optIn();
    } else {
      hubspot.optOut();
    }
  }, [hubspot, hubspotEnabled]);

  const track = useMemo(() => {
    const { ...avoTrack } = Avo;

    return avoTrack;
  }, []);

  initAvo(
    { env: getAvoEnv() },
    {},
    getAnalyticsSDKBridge({ posthog, hubspot })
  );

  const page = useCallback(() => {
    posthog.page();
    hubspot.page();
  }, [posthog, hubspot]);

  useEffect((): (() => void) => {
    router.events.on("routeChangeComplete", page);

    return () => {
      router.events.off("routeChangeComplete", page);
    };
  }, [page]);

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
