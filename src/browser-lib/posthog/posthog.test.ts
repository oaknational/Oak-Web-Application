import posthogJs from "posthog-js";

import { posthogToAnalyticsServiceWithoutQueue } from "./posthog";

const init = jest.fn((key, config) => config.loaded());
const identify = jest.fn();
const capture = jest.fn();
const optInCapturing = jest.fn();
const optOutCapturing = jest.fn();
const getHasConsentedTo = jest.fn(() => "pending");

const posthog = posthogToAnalyticsServiceWithoutQueue(posthogJs);

jest.mock("../cookie-consent/getHasConsentedTo", () => ({
  __esModule: true,
  default: (...args: []) => getHasConsentedTo(...args),
}));
jest.mock("posthog-js", () => ({
  init: (key: unknown, config: unknown) => init(key, config),
  identify: (...args: unknown[]) => identify(...args),
  capture: (...args: unknown[]) => capture(...args),
  opt_in_capturing: (...args: unknown[]) => optInCapturing(...args),
  opt_out_capturing: (...args: unknown[]) => optOutCapturing(...args),
  has_opted_out_capturing: () => true,
}));
describe("posthog.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("init should be called with correct config", async () => {
    const config = {
      apiKey: "12",
      apiHost: "https://test.thenational.academy",
    };
    await posthog.init(config);
    expect(init).toHaveBeenCalledWith(config.apiKey, expect.any(Object));
  });
  test("identify", () => {
    posthog.identify("123", { email: "abc" });
    expect(identify).toHaveBeenCalledWith("123", { email: "abc" });
  });
  test("track", () => {
    posthog.track("foo", { bar: "baz" });
    expect(capture).toHaveBeenCalledWith("foo", { bar: "baz" });
  });
  test("page", () => {
    posthog.page({ path: "/foo/ban" });
    expect(capture).toHaveBeenCalledWith("$pageview");
  });
  test("optIn", () => {
    posthog.optIn();
    expect(optInCapturing).toHaveBeenCalled();
  });
  test("optOut", () => {
    posthog.optOut();
    expect(optOutCapturing).toHaveBeenCalled();
  });
  test("state", () => {
    expect(posthog.state()).toBe("pending");
    getHasConsentedTo.mockImplementationOnce(() => "enabled");
    expect(posthog.state()).toBe("enabled");
    getHasConsentedTo.mockImplementationOnce(() => "disabled");
    expect(posthog.state()).toBe("disabled");
  });
});
