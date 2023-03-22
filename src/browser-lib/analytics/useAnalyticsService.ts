import { useEffect, useState } from "react";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { CookieConsentState } from "../cookie-consent/types";
import { MaybeDistinctId } from "../posthog/posthog";

const useAnalyticsService = <T>({
  service,
  config,
  consentState,
  setPosthogDistinctId,
}: {
  service: AnalyticsService<T>;
  config: T;
  /**
   * using consent state from props rather than sevice.state() because otherwise
   * we'd be reading from local-storage every render
   */
  consentState: CookieConsentState;
  setPosthogDistinctId?: (id: MaybeDistinctId) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);

  useEffect(() => {
    let isUnmounted = false;
    const attemptInit = async () => {
      setHasAttemptedInit(true);
      const distinctId = await service.init(config);
      if (distinctId && setPosthogDistinctId) {
        setPosthogDistinctId(distinctId);
      }
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
  }, [consentState, hasAttemptedInit, config, service, setPosthogDistinctId]);

  useEffect(() => {
    // do not track
    if (loaded) {
      if (consentState === "enabled") {
        service.optIn();
      }
      if (consentState === "disabled") {
        service.optOut();
        if (setPosthogDistinctId) {
          setPosthogDistinctId(null);
        }
      }
    }
  }, [consentState, service, loaded, setPosthogDistinctId]);

  return service;
};

export default useAnalyticsService;
