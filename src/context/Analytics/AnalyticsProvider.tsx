import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import router from "next/router";
import { usePostHog } from "posthog-js/react";
import { useOakConsent } from "@oaknational/oak-consent-client";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import getAvoBridge from "../../browser-lib/avo/getAvoBridge";
import useAnalyticsService from "../../browser-lib/analytics/useAnalyticsService";
import posthogToAnalyticsService, {
  MaybeDistinctId,
  PosthogDistinctId,
} from "../../browser-lib/posthog/posthog";
import hubspotWithQueue from "../../browser-lib/hubspot/hubspot";
import useStableCallback from "../../hooks/useStableCallback";
import isBrowser from "../../utils/isBrowser";
import HubspotScript from "../../browser-lib/hubspot/HubspotScript";
import { getPageViewProps } from "../../browser-lib/analytics/getPageViewProps";
import getBrowserConfig from "../../browser-lib/getBrowserConfig";

import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

type ServiceName = "posthog" | "gleap" | "bugsnag" | "hubspot" | "sentry";
export type UserId = string;
export type EventName = string;
export type EventProperties = Record<string, unknown>;
export type EventFn = (
  eventName: EventName,
  properties: EventProperties,
) => void;
export type PageProperties = {
  path: string;
};
export type PageFn = (properties: PageProperties) => void;
export type IdentifyProperties = { email?: string };
export type IdentifyFn = (
  userId: UserId,
  properties: IdentifyProperties,
  /**
   * if services not specifed, then all services called
   */
  services?: ServiceName[],
) => void;
/**
 * Alias a user id to another user id.
 * This is useful when a user signs up and we want to associate their
 * previously anonymous activity with their new account.
 */
export type AliasFn = (aliasId: UserId, userId: UserId) => void;

export type TrackEventName = Extract<
  keyof typeof Avo,
  | "planALessonSelected"
  | "classroomSelected"
  | "teacherHubSelected"
  | "developYourCurriculumSelected"
  | "notificationSelected"
  | "aboutSelected"
>;

export type TrackFns = Omit<
  typeof Avo,
  "initAvo" | "AvoEnv" | "avoInspectorApiKey"
>;
export type AnalyticsContext = {
  track: TrackFns;
  identify: IdentifyFn;
  alias?: AliasFn;
  posthogDistinctId: PosthogDistinctId | null;
};

export type AnalyticsService<ServiceConfig> = {
  name: ServiceName;
  init: (config: ServiceConfig) => Promise<MaybeDistinctId>;
  state: () => "enabled" | "disabled" | "pending";
  track: EventFn;
  page: PageFn;
  identify: IdentifyFn;
  alias?: AliasFn;
  optOut: () => void;
  optIn: () => void;
};

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
  const [posthogDistinctId, setPosthogDistinctId] =
    useState<PosthogDistinctId | null>(null);
  const [hubspotScriptLoaded, setHubspotScriptLoaded] = useState(false);

  /**
   * Posthog
   */
  const posthogClient = usePostHog();
  if (!posthogClient) {
    throw new Error(
      "AnalyticsProvider should be contained within PostHogProvider",
    );
  }

  const posthogService = useRef(
    posthogToAnalyticsService(posthogClient),
  ).current;
  const posthogConsent = useOakConsent().getConsent(ServicePolicyMap.POSTHOG);
  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";
  const posthog = useAnalyticsService({
    service: posthogService,
    config: {
      apiKey: getBrowserConfig("posthogApiKey"),
      apiHost: isDevelopmentBuild
        ? "/ingest"
        : getBrowserConfig("posthogApiHost"),
      uiHost: isDevelopmentBuild
        ? getBrowserConfig("posthogApiHost")
        : undefined,
    },
    consentState: posthogConsent,
    setPosthogDistinctId,
  });

  /**
   * Hubspot
   */
  const hubspotConfig = {
    portalId: getBrowserConfig("hubspotPortalId"),
    scriptDomain: getBrowserConfig("hubspotScriptDomain"),
  };
  const hubspotConsent = useOakConsent().getConsent(ServicePolicyMap.HUBSPOT);
  const hubspot = useAnalyticsService({
    service: hubspotWithQueue,
    config: hubspotConfig,
    scriptLoaded: hubspotScriptLoaded,
    consentState: hubspotConsent,
  });
  const onHubspotScriptLoaded = useCallback(() => {
    setHubspotScriptLoaded(true);
  }, []);

  /**
   * Avo
   */
  initAvo(
    { env: getAvoEnv(), webDebugger: false, ...avoOptions },
    {},
    getAvoBridge({ posthog }),
  );

  /**
   * Page view tracking
   */
  const page = useStableCallback(() => {
    const path = getPathAndQuery();

    // Send a simple page event to hubspot
    hubspot.page({ path });

    // We send the posthog $pageview event via Avo
    const { analyticsUseCase, pageName } = getPageViewProps(path);
    track.pageview({
      linkUrl: router.asPath,
      pageName,
      analyticsUseCase,
    });
  });

  // hacky way to ensure page-tracking is called on initial page load:
  const [initialRouteTracked, setInitialRouteTracked] = useState(false);

  useEffect(() => {
    if (!initialRouteTracked) {
      page();
      setInitialRouteTracked(true);
    }
    router.events.on("routeChangeComplete", page);

    return () => {
      router.events.off("routeChangeComplete", page);
    };
  }, [page, posthog, hubspot, initialRouteTracked, setInitialRouteTracked]);

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
    [hubspot, posthog],
  );
  const alias: AliasFn = useCallback(
    (aliasId, userId) => {
      posthog.alias?.(aliasId, userId);
    },
    [posthog],
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
      alias,
      posthogDistinctId,
    };
  }, [track, identify, posthogDistinctId, alias]);

  return (
    <analyticsContext.Provider value={analytics}>
      {children}
      <HubspotScript
        shouldLoad={hubspotConsent === "granted"}
        onLoad={onHubspotScriptLoaded}
        {...hubspotConfig}
      />
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
