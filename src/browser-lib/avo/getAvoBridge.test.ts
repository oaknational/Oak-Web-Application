import { PostHog as PostHogNode } from "posthog-node";

import getAvoBridge from "./getAvoBridge";

type PostHogBrowser = {
  track: jest.Mock;
  identify: jest.Mock;
};

function getMockPosthog(
  environment: "browser" | "server" = "browser",
): PostHogBrowser | PostHogNode {
  if (environment === "browser") {
    return {
      track: jest.fn(),
      identify: jest.fn(),
    };
  } else {
    const mockPostHog = new PostHogNode("test-key");
    mockPostHog.capture = jest.fn();
    mockPostHog.identify = jest.fn();
    return mockPostHog;
  }
}

const testEventName = "test-event";
const testEventProperties = {
  org: "oak national",
};

describe("getAvoBridge (browser)", () => {
  test("logEvent", () => {
    const posthog = getMockPosthog("browser") as PostHogBrowser;
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent(testEventName, testEventProperties);

    expect(posthog.track).toHaveBeenCalledWith(
      testEventName,
      testEventProperties,
    );
  });

  test("identity", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.identify("123");

    expect(posthog.identify).toHaveBeenCalledWith("123", {});
  });

  test("setUserProperties", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.setUserProperties("123", { foo: "bar " });

    expect(posthog.identify).toHaveBeenCalledWith("123", { foo: "bar " });
  });
});

describe("getAvoBridge (server)", () => {
  test("logEvent", () => {
    const posthog = getMockPosthog("server") as PostHogNode;
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent(testEventName, {
      ...testEventProperties,
      userId: "123",
    });

    expect(posthog.capture).toHaveBeenCalledWith({
      distinctId: "123",
      event: testEventName,
      properties: { ...testEventProperties, userId: "123" },
    });
  });

  test("identify", () => {
    const posthog = getMockPosthog("server") as PostHogNode;
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.identify("123");

    expect(posthog.identify).toHaveBeenCalledWith({
      distinctId: "123",
      properties: {},
    });
  });
});
