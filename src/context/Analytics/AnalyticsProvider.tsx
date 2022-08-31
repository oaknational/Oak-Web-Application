import { createContext, FC, useCallback, useEffect, useMemo } from "react";
import router from "next/router";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import getAvoBridge from "../../browser-lib/avo/getAvoBridge";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import { ServiceType } from "../../browser-lib/cookie-consent/types";
import useAnalyticsService from "../../browser-lib/analytics/useAnalyticsService";
import posthogWithQueue from "../../browser-lib/posthog/posthog";
import hubspotWithQueue from "../../browser-lib/hubspot/hubspot";
import config from "../../config";
import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import useStableCallback from "../../hooks/useStableCallback";
import isBrowser from "../../utils/isBrowser";

export type UserId = string;
export type EventName = string;
export type EventProperties = Record<string, unknown>;
export type EventFn = (
  eventName: EventName,
  properties: EventProperties
) => void;
export type PageProperties = { path: string };
export type PageFn = (properties: PageProperties) => void;
export type IdentifyProperties = { email?: string };
export type IdentifyFn = (
  userId: UserId,
  properties: IdentifyProperties
) => void;

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;
type AnalyticsContext = {
  track: TrackFns;
  identify: IdentifyFn;
};

export type AnalyticsService<ServiceConfig> = {
  name: ServiceType;
  init: (config: ServiceConfig) => Promise<void>;
  state: () => "enabled" | "disabled" | "pending";
  track: EventFn;
  page: PageFn;
  identify: IdentifyFn;
  optOut: () => void;
  optIn: () => void;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const getPathAndQuery = () => {
  if (!isBrowser) {
    throw new Error("getPathAndQuery run outside of the browser");
  }
  return window.location.pathname + window.location.search;
};

const AnalyticsProvider: FC = (props) => {
  const { children } = props;

  const trackingEnabled = useCookieConsent().hasConsentedToPolicy("statistics");

  /**
   * Posthog
   */
  const posthogConsent = useHasConsentedTo("posthog");
  const posthog = useAnalyticsService({
    service: posthogWithQueue,
    config: {
      apiHost: config.get("posthogApiHost"),
      apiKey: config.get("posthogApiKey"),
    },
    consentState: posthogConsent,
  });

  /**
   * Hubspot
   */
  const hubspotConsent = useHasConsentedTo("hubspot");
  const hubspot = useAnalyticsService({
    service: hubspotWithQueue,
    config: {
      portalId: config.get("hubspotPortalId"),
      scriptDomain: config.get("hubspotScriptDomain"),
    },
    consentState: hubspotConsent,
  });

  /**
   * Avo
   */
  initAvo({ env: getAvoEnv() }, {}, getAvoBridge({ posthog, hubspot }));

  /**
   * Page view tracking
   */
  const page = useStableCallback(() => {
    const props = { path: getPathAndQuery() };
    posthog.page(props);
    hubspot.page(props);
  });
  useEffect(() => {
    page();
  }, [page]);
  useEffect(() => {
    router.events.on("routeChangeComplete", () => page());

    return () => {
      router.events.off("routeChangeComplete", page);
    };
  }, [page]);

  /**
   * Identify
   * To be called on form submission (or later on sign up)
   */
  const identify: IdentifyFn = useCallback(
    (id, props) => {
      posthog.identify(id, props);
      hubspot.identify(id, props);
    },
    [posthog, hubspot]
  );

  /**
   * Event tracking
   * Object containing Track functions as defined in the Avo tracking plan.
   * Track functions are then called for individual services as found in
   * getAvoBridge.
   */
  const track = useMemo(() => {
    const avoTrack = Object.keys(Avo).reduce((accum, key) => {
      if (trackingEnabled) {
        return Avo;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        accum[key] = () => {
          console.log("Track called, but no consent given");
        };
        return accum;
      }
    }, Avo);

    return avoTrack;
  }, [trackingEnabled]);

  /**
   * analytics
   * The analytics instance returned by useAnalytics hooks
   */
  const analytics = useMemo(() => {
    return {
      track,
      identify,
    };
  }, [track, identify]);

  return (
    <analyticsContext.Provider value={analytics}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
