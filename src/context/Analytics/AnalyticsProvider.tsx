import { createContext, FC, useMemo } from "react";

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

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const AnalyticsProvider: FC = (props) => {
  const { children } = props;

  const posthogEnabled = useHasConsentedTo("posthog");
  const posthog = usePosthog({ enabled: posthogEnabled });
  const hubspotEnabled = useHasConsentedTo("hubspot");
  const hubspot = useHubspot({ enabled: hubspotEnabled });

  const track = useMemo(() => {
    const { ...avoTrack } = Avo;

    return avoTrack;
  }, []);

  initAvo(
    { env: getAvoEnv() },
    {},
    getAnalyticsSDKBridge({ posthog, hubspot })
  );

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
