import { render } from "@testing-library/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ComponentProps } from "react";

import SpeedInsightsWrapper from "./SpeedInsightsWrapper";

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: jest.fn(() => null),
}));

const speedInsights = jest.mocked(SpeedInsights);
type BeforeSendEvent = Parameters<
  NonNullable<ComponentProps<typeof SpeedInsights>["beforeSend"]>
>[0];

describe("SpeedInsightsWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses a 10% sample rate", () => {
    render(<SpeedInsightsWrapper />);

    expect(speedInsights).toHaveBeenCalled();
    expect(speedInsights.mock.calls[0]![0].sampleRate).toBe(0.1);
  });

  it.each([
    "https://www.thenational.academy/teachers",
    "https://www.thenational.academy/teachers/",
    "https://www.thenational.academy/teachers/lessons/example",
  ])("returns the original event for %s", (url) => {
    render(<SpeedInsightsWrapper />);

    const { beforeSend } = speedInsights.mock.calls[0]![0];
    const event: BeforeSendEvent = {
      type: "vital",
      url,
      route: "/teachers/[...slug]",
    };

    expect(beforeSend).toEqual(expect.any(Function));
    expect(beforeSend?.(event)).toBe(event);
  });

  it.each([
    "https://www.thenational.academy/",
    "https://www.thenational.academy/pupils",
    "https://www.thenational.academy/pupils/lessons/example",
  ])("discards the event for %s", (url) => {
    render(<SpeedInsightsWrapper />);

    const { beforeSend } = speedInsights.mock.calls[0]![0];
    const event: BeforeSendEvent = { type: "vital", url };

    expect(beforeSend).toEqual(expect.any(Function));
    expect(beforeSend?.(event)).toBeNull();
  });
});
