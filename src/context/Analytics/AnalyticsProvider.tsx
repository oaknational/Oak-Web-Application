import { createContext, FC, useCallback, useEffect, useMemo } from "react";
import router from "next/router";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import usePosthog from "../../browser-lib/posthog/usePosthog";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import getAvoBridge from "../../browser-lib/avo/getAvoBridge";
import useHubspot from "../../browser-lib/hubspot/useHubspot";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;
type AnalyticsContext = {
  track: TrackFns;
};

export type UserId = string;
export type EventName = string;
export type EventProperties = Record<string, unknown>;
export type EventFn = (
  eventName: EventName,
  properties: EventProperties
) => void;
export type PageFn = () => void;
export type IdentifyProperties = { email?: string };
export type IdentifyFn = (
  userId: UserId,
  properties: IdentifyProperties
) => void;

export type AnalyticsService<ServiceConfig> = {
  init: (config: ServiceConfig) => void;
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

  const trackingEnabled = useCookieConsent().hasConsentedToPolicy("statistics");

  /**
   * Posthog
   */
  const posthogEnabled = useHasConsentedTo("posthog");
  const posthog = usePosthog({ enabled: posthogEnabled });

  /**
   * Hubspot
   */
  const hubspotEnabled = useHasConsentedTo("hubspot");
  const hubspot = useHubspot({ enabled: hubspotEnabled });

  /**
   * Avo
   */
  initAvo({ env: getAvoEnv() }, {}, getAvoBridge({ posthog, hubspot }));

  /**
   * Page view tracking
   */
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

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
