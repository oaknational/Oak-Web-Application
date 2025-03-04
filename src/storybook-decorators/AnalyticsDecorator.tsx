import { StoryFn } from "@storybook/react";

import * as Avo from "../browser-lib/avo/Avo";
import { analyticsContext } from "../context/Analytics/AnalyticsProvider";
import { testPosthogDistinctId } from "../__tests__/__helpers__/MockedAnalyticsProvider";
import noop from "../__tests__/__helpers__/noop";

const { NavigatedFrom, initAvo, ...trackingFns } = Avo;
type TrackingFns = typeof trackingFns;
const noopTrackingFns = Object.entries(trackingFns).reduce(
  (acc, [key, value]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[key] = value;
    return acc;
  },
  {} as unknown as TrackingFns,
);
export default function AnalyticsDecorator(Story: StoryFn) {
  const value = {
    identify: noop,
    alias: noop,
    posthogDistinctId: testPosthogDistinctId,
    track: {
      ...noopTrackingFns,
      NavigatedFrom,
    },
  };

  return (
    <analyticsContext.Provider value={value}>
      <Story />
    </analyticsContext.Provider>
  );
}
