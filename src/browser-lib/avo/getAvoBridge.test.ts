import getAvoBridge from "./getAvoBridge";

type PostHogBrowser = {
  track: jest.Mock;
  identify: jest.Mock;
};

function getMockPosthog(): PostHogBrowser {
  return {
    track: jest.fn(),
    identify: jest.fn(),
  };
}

const testEventName = "test-event";
const testEventProperties = {
  org: "oak national",
};

describe("getAvoBridge (browser)", () => {
  test("logEvent", () => {
    const posthog = getMockPosthog();
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
