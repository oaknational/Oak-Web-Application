import { createContext, FC, useMemo } from "react";

import Avo, { initAvo } from "../../browser-lib/avo/Avo";
import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import usePosthog from "../../browser-lib/posthog/usePosthog";
import getAvoEnv from "../../browser-lib/avo/getAvoEnv";
import analyticsSDKBridge from "../../browser-lib/avo/analyticsSDKBridge";

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;
type AnalyticsContext = {
  track: TrackFns;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

const AnalyticsProvider: FC = (props) => {
  const { children } = props;

  const posthogEnabled = useHasConsentedTo("posthog");
  usePosthog({ enabled: posthogEnabled });

  const track = useMemo(() => {
    const { ...avoTrack } = Avo;

    return avoTrack;
  }, []);

  initAvo({ env: getAvoEnv() }, {}, analyticsSDKBridge);

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
