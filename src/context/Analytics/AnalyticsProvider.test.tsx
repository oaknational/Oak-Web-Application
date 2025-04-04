import { render } from "@testing-library/react";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import AnalyticsProvider from "./AnalyticsProvider";
import useAnalytics from "./useAnalytics";

import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

const posthogIdentify = jest.fn();
const posthogCapture = jest.fn();
const posthogInit = jest.fn();

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
    <CookieConsentProvider client={new MockOakConsentClient()}>
      <PostHogProvider
        // eslint-disable-next-line
        // @ts-ignore
        client={{
          identify: (...args: []) => posthogIdentify(...args),
          capture: (...args: []) => posthogCapture(...args),
          init: (...args: []) => posthogInit(...args),
        }}
      >
        <AnalyticsProvider
          avoOptions={{
            inspector: {
              _avoFunctionTrackSchemaFromEvent: jest.fn(),
            },
            avoLogger: {
              logDebug: jest.fn(),
              logWarn: jest.fn(),
              logError: jest.fn(),
            },
          }}
        >
          <ChildCallingIdentify />
        </AnalyticsProvider>
      </PostHogProvider>
    </CookieConsentProvider>
  );
};

jest.mock("@/browser-lib/getBrowserConfig", () => {
  return jest.fn().mockReturnValue("development");
});

console.log = jest.fn();

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("service.identify() should be called if service included in array", () => {
    callWithArgs.mockImplementation((identify) =>
      identify("someone", {}, ["posthog"]),
    );

    render(<CallIdentify />);

    expect(console.log).toHaveBeenCalledWith(
      "[avo] Event Sent:",
      "$pageview",
      "Event Props:",
      { "Analytics Use Case": null, "Link URL": "/", "Page Name": "Homepage" },
      "User Props:",
      {},
    );
    expect(posthogIdentify).toHaveBeenCalledWith("someone", {});
  });
  test("service.identify() should not be called if service not included in array", () => {
    callWithArgs.mockImplementation((identify) =>
      identify("someone", {}, ["hubspot"]),
    );

    render(<CallIdentify />);

    expect(console.log).toHaveBeenCalledWith(
      "[avo] Event Sent:",
      "$pageview",
      "Event Props:",
      { "Analytics Use Case": null, "Link URL": "/", "Page Name": "Homepage" },
      "User Props:",
      {},
    );
    expect(posthogIdentify).not.toHaveBeenCalled();
  });
  test("service.identify() should be called if no services array passed", () => {
    callWithArgs.mockImplementation((identify) => identify("someone", {}));

    render(<CallIdentify />);

    expect(console.log).toHaveBeenCalledWith(
      "[avo] Event Sent:",
      "$pageview",
      "Event Props:",
      { "Analytics Use Case": null, "Link URL": "/", "Page Name": "Homepage" },
      "User Props:",
      {},
    );
    expect(posthogIdentify).toHaveBeenCalledWith("someone", {});
  });
});
