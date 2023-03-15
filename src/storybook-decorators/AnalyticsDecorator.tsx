import { Story } from "@storybook/react";

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
  {} as unknown as TrackingFns
);
export default function AnalyticsDecorator(Story: Story) {
  const value = {
    identify: noop,
    posthogSetLegacyAnonymousId: noop,
    posthogDistinctId: testPosthogDistinctId,
    track: {
      // planALessonSelected: noop,
      // classroomSelected: noop,
      // teacherHubSelected: noop,
      // developYourCurriculumSelected: noop,
      // notificationSelected: noop,
      // aboutSelected: noop,
      // newsletterSignUpCompleted: noop,
      // videoStarted: noop,
      // videoPaused: noop,
      // videoPlayed: noop,
      // videoFinished: noop,
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
