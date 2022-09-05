import { useEffect, useState } from "react";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { CookieConsentState } from "../cookie-consent/types";

const useAnalyticsService = <T>({
  service,
  config,
  consentState,
}: {
  service: AnalyticsService<T>;
  config: T;
  /**
   * using consent state from props rather than sevice.state() because otherwise
   * we'd be reading from local-storage every render
   */
  consentState: CookieConsentState;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);

  useEffect(() => {
    let isUnmounted = false;
    const attemptInit = async () => {
      setHasAttemptedInit(true);
      await service.init(config);
      if (!isUnmounted) {
        setLoaded(true);
      }
    };
    // init
    if (consentState === "enabled" && !hasAttemptedInit) {
      attemptInit();
    }
    return () => {
      isUnmounted = true;
    };
  }, [consentState, hasAttemptedInit, config, service]);

  useEffect(() => {
    // do not track
    if (loaded) {
      if (consentState === "enabled") {
        service.optIn();
      }
      if (consentState === "disabled") {
        service.optOut();
      }
    }
  }, [consentState, service, loaded]);

  return service;
};

export default useAnalyticsService;
