import getAvoBridge from "./getAvoBridge";

const posthog = {
  track: jest.fn(),
};

const testEventName = "test-event";
const testEventProperties = {
  org: "oak national",
};

describe("getAvoBridge", () => {
  test("logEvent", () => {
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent(testEventName, testEventProperties);

    expect(posthog.track).toHaveBeenCalledWith(
      testEventName,
      testEventProperties
    );
  });
});
