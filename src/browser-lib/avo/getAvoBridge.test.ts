import getAvoBridge from "./getAvoBridge";

function getMockPosthog() {
  return {
    track: jest.fn(),
    identify: jest.fn(),
    setUserProperties: jest.fn(),
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
      { sendInstantly: false },
    );
  });

  test("logEvent sends instantly for User Onboarding Completed", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent("User Onboarding Completed", testEventProperties);

    expect(posthog.track).toHaveBeenCalledWith(
      "User Onboarding Completed",
      testEventProperties,
      { sendInstantly: true },
    );
  });

  test("identity", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.identify("123");

    expect(posthog.identify).toHaveBeenCalledWith("123", {});
  });

  test.each([
    "NC Insights Dwell Time Recorded",
    "NC Insights Dwell Threshold Reached",
    "NC Insights Engagement Criteria Met",
    "NC Insights CTA Clicked",
  ])("sends %s immediately for page exits", (eventName) => {
    const posthog = getMockPosthog();
    getAvoBridge({ posthog }).logEvent(eventName, {
      timeElapsedSeconds: 12,
    });
    expect(posthog.track).toHaveBeenCalledWith(
      eventName,
      { timeElapsedSeconds: 12 },
      { sendInstantly: true },
    );
  });

  test("setUserProperties", () => {
    const posthog = getMockPosthog();
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.setUserProperties("123", { foo: "bar " });

    expect(posthog.identify).toHaveBeenCalledWith("123", { foo: "bar " });
  });
});
