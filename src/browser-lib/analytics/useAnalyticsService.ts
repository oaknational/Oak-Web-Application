import { useEffect, useState } from "react";

import { AnalyticsService } from "../../context/Analytics/AnalyticsProvider";
import { MaybeDistinctId } from "../posthog/posthog";

const useAnalyticsService = <T>({
  service,
  config,
  consentState,
  setPosthogDistinctId,
  scriptLoaded = false,
}: {
  service: AnalyticsService<T>;
  config: T;
  /**
   * using consent state from props rather than sevice.state() because otherwise
   * we'd be reading from local-storage every render
   */
  consentState: "pending" | "granted" | "denied";
  setPosthogDistinctId?: (id: MaybeDistinctId) => void;
  scriptLoaded?: boolean;
}) => {
  const [loaded, setLoaded] = useState(scriptLoaded);
  const [hasAttemptedInit, setHasAttemptedInit] = useState(scriptLoaded);

  useEffect(() => {
    setLoaded(scriptLoaded);
  }, [scriptLoaded]);

  useEffect(() => {
    const attemptInit = async () => {
      setHasAttemptedInit(true);
      const distinctId = await service.init(config);
      if (distinctId && setPosthogDistinctId) {
        setPosthogDistinctId(distinctId);
        setLoaded(true);
      }
    };
    if (consentState === "granted" && !hasAttemptedInit) {
      attemptInit();
    }
  }, [consentState, hasAttemptedInit, config, service, setPosthogDistinctId]);

  useEffect(() => {
    // do not track
    if (loaded) {
      if (consentState === "granted") {
        service.optIn();
      }
      if (consentState === "denied") {
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
