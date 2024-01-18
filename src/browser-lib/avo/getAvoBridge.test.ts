import getAvoBridge from "./getAvoBridge";

const posthog = {
  track: vi.fn(),
};

const testEventName = "test-event";
const testEventProperties = {
  org: "oak national",
};

describe("getAvoBridge", () => {
  it("logEvent", () => {
    const avoBridge = getAvoBridge({ posthog });
    avoBridge.logEvent(testEventName, testEventProperties);

    expect(posthog.track).toHaveBeenCalledWith(
      testEventName,
      testEventProperties,
    );
  });
});
