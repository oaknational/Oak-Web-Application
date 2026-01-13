import { render } from "@testing-library/react";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import AnalyticsProvider, { getPathAndQuery } from "./AnalyticsProvider";
import useAnalytics from "./useAnalytics";

import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

// mock window.location.search
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (globalThis as any).location;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).location = { search: "" };

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

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
console.info = jest.fn();

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
    expect(console.info).toHaveBeenCalledWith(
      "No HubSpot cookie found, user likely has not interacted with HubSpot",
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
    expect(console.info).toHaveBeenCalledWith(
      "No HubSpot cookie found, user likely has not interacted with HubSpot",
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
    expect(console.info).toHaveBeenCalledWith(
      "No HubSpot cookie found, user likely has not interacted with HubSpot",
    );
    expect(posthogIdentify).toHaveBeenCalledWith("someone", {});
  });
});

describe("getPathAndQuery", () => {
  test("throws an error is run outside the browser", () => {
    expect(() =>
      getPathAndQuery({
        pathName: "/test",

        isBrowser: false,
      }),
    ).toThrow("getPathAndQuery run outside of the browser");
  });

  test("throws an error if pathName is null", () => {
    expect(() =>
      getPathAndQuery({
        pathName: null,

        isBrowser: true,
      }),
    ).toThrow("getPathAndQuery run outside of the browser");
  });

  test("returns pathname and searchParams with a question mark between them", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).location.search = "?foo=bar&baz=qux";

    const result = getPathAndQuery({
      pathName: "/test-path",
      isBrowser: true,
    });

    expect(result).toBe("/test-path?foo=bar&baz=qux");
  });

  test("does not include params or a question mark when they aren't present", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).location.search = "";

    const result = getPathAndQuery({
      pathName: "/test-path",
      isBrowser: true,
    });

    expect(result).toBe("/test-path");
  });
});
