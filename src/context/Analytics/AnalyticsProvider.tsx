import { createContext, FC, useMemo } from "react";
import posthog from "posthog-js";

import useHasConsentedTo from "../../browser-lib/cookie-consent/useHasConsentedTo";
import Avo, { AvoEnv, initAvo } from "../../browser-lib/avo/Avo";
import usePosthog from "../../browser-lib/posthog/usePosthog";
import config from "../../config";

type TrackFns = Omit<typeof Avo, "initAvo" | "AvoEnv" | "avoInspectorApiKey">;

type AnalyticsContext = {
  track: TrackFns;
};

export const analyticsContext = createContext<AnalyticsContext | null>(null);

initAvo(
  {
    // @todo: use release stage from constants
    env: config.get("releaseStage") === "production" ? AvoEnv.Prod : AvoEnv.Dev,
  },
  {},
  {
    logEvent: function (name, props) {
      posthog.capture(name, props);
    },
  }
);

const AnalyticsProvider: FC = (props) => {
  const { children } = props;
  const posthogEnabled = useHasConsentedTo("posthog");

  usePosthog({ enabled: posthogEnabled });

  const track = useMemo(() => {
    const { ...avoTrack } = Avo;

    return avoTrack;
  }, []);

  return (
    <analyticsContext.Provider value={{ track }}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsProvider;
