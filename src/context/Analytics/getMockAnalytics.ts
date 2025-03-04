import { AnalyticsContext } from "./AnalyticsProvider";

import Avo from "@/browser-lib/avo/Avo";

export function getMockAnalytics(): AnalyticsContext {
  return {
    track: {
      ...Object.entries(Avo).reduce(
        (acc, [key]) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = () => {
            console.log(`Mock track called with event: ${key}`);
          };
          return acc;
        },
        {} as typeof Avo,
      ),
    },
    posthogDistinctId: "mock-distinct-id",
    identify: () => {
      console.log("Mock identify called");
    },
    alias: () => {
      console.log("Mock alias called");
    },
  };
}
