import { render } from "@testing-library/react";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

import AnalyticsProvider from "./AnalyticsProvider";
import useAnalytics from "./useAnalytics";

const posthogIdentify = jest.fn();
const posthogCapture = jest.fn();
const posthogInit = jest.fn();
jest.mock("../../browser-lib/cookie-consent/CookieConsentProvider", () => ({
  __esModule: true,
  useCookieConsent: () => ({
    hasConsentedTo: () => "enabled",
  }),
}));
/**
 * mock withQueue as identity, because the queue messes with tests, and itself
 * is tested separately
 */
jest.mock("../../browser-lib/analytics/withQueue", () => ({
  __esModule: true,
  default: (x: unknown) => x,
}));

const callWithArgs = jest.fn((identify) => identify());

const ChildCallingIdentify = () => {
  const { identify } = useAnalytics();
  useEffect(() => {
    callWithArgs(identify);
  });
  return <div />;
};

const CallIdentify = () => {
  return (
    <PostHogProvider
      // eslint-disable-next-line
      // @ts-ignore
      client={{
        identify: (...args: []) => posthogIdentify(...args),
        capture: (...args: []) => posthogCapture(...args),
        init: (...args: []) => posthogInit(...args),
      }}
    >
      <AnalyticsProvider>
        <ChildCallingIdentify />
      </AnalyticsProvider>
    </PostHogProvider>
  );
};

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("service.identify() should be called if service included in array", () => {
    callWithArgs.mockImplementation((identify) =>
      identify("someone", {}, ["posthog"])
    );

    render(<CallIdentify />);

    expect(posthogIdentify).toHaveBeenCalledWith("someone", {});
  });
  test("service.identify() should not be called if service not included in array", () => {
    callWithArgs.mockImplementation((identify) =>
      identify("someone", {}, ["hubspot"])
    );

    render(<CallIdentify />);

    expect(posthogIdentify).not.toHaveBeenCalled();
  });
  test("service.identify() should be called if no services array passed", () => {
    callWithArgs.mockImplementation((identify) => identify("someone", {}));

    render(<CallIdentify />);

    expect(posthogIdentify).toHaveBeenCalledWith("someone", {});
  });
});
