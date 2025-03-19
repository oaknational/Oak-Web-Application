import { AnalyticsContext } from "./AnalyticsProvider";

import Avo from "@/browser-lib/avo/Avo";

const isStorybook = () => !!process.env.STORYBOOK;

export function getMockAnalytics(): AnalyticsContext {
  return {
    track: {
      ...Object.entries(Avo).reduce(
        (acc, [key]) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = () => {
            if (isStorybook()) {
              console.log(`Mock track called with event: ${key}`);
            }
          };
          return acc;
        },
        {} as typeof Avo,
      ),
    },
    posthogDistinctId: "mock-distinct-id",
    identify: () => {
      if (isStorybook()) {
        console.log("Mock identify called");
      }
    },
    alias: () => {
      if (isStorybook()) {
        console.log("Mock alias called");
      }
    },
  };
}
