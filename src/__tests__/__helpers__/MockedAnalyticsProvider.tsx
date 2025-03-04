import { FC } from "react";

import Avo from "../../browser-lib/avo/Avo";
import { analyticsContext } from "../../context/Analytics/AnalyticsProvider";

import noop from "./noop";

export const testPosthogDistinctId = "test-posthog-distinct-i";

const MockedAnalyticsProvider: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const noopTrack = Object.entries(Avo).reduce(
    (acc, [trackName]) => {
      // eslint-disable-next-line
      // @ts-ignore
      acc[trackName] = noop;

      return acc;
    },
    {} as typeof Avo,
  );
  return (
    <analyticsContext.Provider
      value={{
        track: noopTrack,
        identify: noop,
        alias: noop,
        posthogDistinctId: testPosthogDistinctId,
      }}
    >
      {children}
    </analyticsContext.Provider>
  );
};

export default MockedAnalyticsProvider;
