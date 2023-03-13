import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import router from "next/router";
import { usePostHogContext } from "posthog-js/react";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import getAvoBridge from "../../browser-lib/avo/getAvoBridge";
import { ServiceType } from "../../browser-lib/cookie-consent/types";
import useAnalyticsService from "../../browser-lib/analytics/useAnalyticsService";
import posthogToAnalyticsService, {
  PosthogConfig,
} from "../../browser-lib/posthog/posthog";
import hubspotWithQueue from "../../browser-lib/hubspot/hubspot";
import config from "../../config/browser";
import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import useStableCallback from "../../hooks/useStableCallback";
import isBrowser from "../../utils/isBrowser";
import { HubspotConfig } from "../../browser-lib/hubspot/startHubspot";

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
  properties: IdentifyProperties,
  /**
   * if services not specifed, then all services called
   */
  services?: ServiceType[]
) => void;

export type TrackEventName = Extract<
  keyof typeof Avo,
  | "planALessonSelected"
  | "classroomSelected"
  | "teacherHubSelected"
  | "developYourCurriculumSelected"
  | "notificationSelected"
  | "aboutSelected"
>;

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;
type AnalyticsContext = {
  track: TrackFns;
  identify: IdentifyFn;
  posthogSetAnonymousId: (id: string) => void;
};

export type AnalyticsService<ServiceConfig> = {
  name: ServiceType;
  init: (config: ServiceConfig) => Promise<void>;
  state: () => "enabled" | "disabled" | "pending";
  track: EventFn;
  page: PageFn;
  identify: IdentifyFn;
  /**
   * setAnonymousId associates
   */
  setAnonymousId: (id: string) => void;
  optOut: () => void;
  optIn: () => void;
};
type AnalyticsServiceWithConfig =
  | AnalyticsService<HubspotConfig>
  | AnalyticsService<PosthogConfig>;

type AvoOptions = Parameters<typeof initAvo>[0];

export type AnalyticsProviderProps = {
  children?: React.ReactNode;
  avoOptions?: Partial<AvoOptions>;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const getPathAndQuery = () => {
  if (!isBrowser) {
    throw new Error("getPathAndQuery run outside of the browser");
  }
  return window.location.pathname + window.location.search;
};

const AnalyticsProvider: FC<AnalyticsProviderProps> = (props) => {
  const { children, avoOptions = {} } = props;

  /**
   * Posthog
   */
  const { client: posthogClient } = usePostHogContext();
  if (!posthogClient) {
    throw new Error(
      "AnalyticsProvider should be contained within PostHogProvider"
    );
  }

  const posthogService = useRef(
    posthogToAnalyticsService(posthogClient)
  ).current;
  const posthogConsent = useHasConsentedTo("posthog");
  const posthog = useAnalyticsService({
    service: posthogService,
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
  initAvo(
    { env: getAvoEnv(), webDebugger: false, ...avoOptions },
    {},
    getAvoBridge({ posthog })
  );

  /**
   * Page view tracking
   */
  const page = useStableCallback(
    (opts: { services: AnalyticsServiceWithConfig[] }) => {
      const { services } = opts;
      const props = { path: getPathAndQuery() };
      services.forEach((service) => {
        service.page(props);
      });
    }
  );

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      page({ services: [posthog, hubspot] });
    });

    return () => {
      router.events.off("routeChangeComplete", page);
    };
  }, [page, posthog, hubspot]);

  /**
   * Identify
   * To be called on form submission (or later on sign up).
   * Currently we're only sending identify calls to hubspot.
   */
  const identify: IdentifyFn = useCallback(
    (id, props, services) => {
      const allServices = !services;
      if (allServices || services?.includes("hubspot")) {
        hubspot.identify(id, props);
      }
      if (allServices || services?.includes("posthog")) {
        posthog.identify(id, props);
      }
    },
    [hubspot, posthog]
  );
  /**
   * Event tracking
   * Object containing Track functions as defined in the Avo tracking plan.
   * Track functions are then called for individual services as found in
   * getAvoBridge.
   * @todo explicitly define track event names and pick them from Avo.
   */
  const track = useMemo(() => {
    return Avo;
  }, []);

  /**
   * analytics
   * The analytics instance returned by useAnalytics hooks
   */
  const analytics = useMemo(() => {
    return {
      track,
      identify,
      posthogSetAnonymousId: posthog.setAnonymousId,
    };
  }, [track, identify, posthog]);

  return (
    <analyticsContext.Provider value={analytics}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
