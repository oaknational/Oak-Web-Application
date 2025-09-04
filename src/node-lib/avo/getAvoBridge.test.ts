import { PostHog as PostHogNode } from "posthog-node";

import getAvoBridge from "./getAvoBridge";

function getMockPosthog(): PostHogNode {
  const mockPostHog = new PostHogNode("test-key");
  mockPostHog.capture = jest.fn();
  mockPostHog.identify = jest.fn();
  return mockPostHog;
}

const testEventName = "test-event";
const testEventProperties = {
  org: "oak national",
};

describe("getAvoBridge (server)", () => {
  test("logEvent", () => {
    const posthog = getMockPosthog();
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

  test("logEvent with anonymous user", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent(testEventName, testEventProperties);

    expect(posthog.capture).toHaveBeenCalledWith({
      distinctId: "anonymous",
      event: testEventName,
      properties: testEventProperties,
    });
  });

  test("identify", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.identify("123");

    expect(posthog.identify).toHaveBeenCalledWith({
      distinctId: "123",
      properties: {},
    });
  });

  test("setUserProperties", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.setUserProperties("123", { foo: "bar" });

    expect(posthog.identify).toHaveBeenCalledWith({
      distinctId: "123",
      properties: { foo: "bar" },
    });
  });
});
