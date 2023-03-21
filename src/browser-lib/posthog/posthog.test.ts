import posthogJs from "posthog-js";

import { posthogToAnalyticsServiceWithoutQueue } from "./posthog";

const getLegacyAnonymousId = jest.fn();
jest.mock("../analytics/getLegacyAnonymousId", () => ({
  __esModule: true,
  default: (...args: []) => getLegacyAnonymousId(...args),
}));

const init = jest.fn((key, config) => config.loaded());
const identify = jest.fn();
const capture = jest.fn();
const optInCapturing = jest.fn();
const optOutCapturing = jest.fn();
const getHasConsentedTo = jest.fn(() => "pending");

const posthog = posthogToAnalyticsServiceWithoutQueue(posthogJs);
const textDistinctId = "test-distinct-id";

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
  get_distinct_id: () => textDistinctId,
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
  test("init return distinct id", async () => {
    const config = {
      apiKey: "12",
      apiHost: "https://test.thenational.academy",
    };
    const distinctId = await posthog.init(config);
    expect(distinctId).toBe(textDistinctId);
  });
  test("identify", () => {
    posthog.identify("123", { email: "abc" });
    expect(identify).toHaveBeenCalledWith("123", { email: "abc" });
  });
  test("track", () => {
    posthog.track("foo", { bar: "baz" });
    expect(capture).toHaveBeenCalledWith("foo", {
      bar: "baz",
      $set_once: {},
    });
  });
  test("track sets legacy_anonymous_id", () => {
    getLegacyAnonymousId.mockImplementationOnce(
      () => "test legacy anonymous id"
    );
    posthog.track("foo", { bar: "baz" });
    expect(capture).toHaveBeenCalledWith("foo", {
      $set_once: {
        legacy_anonymous_id: "test legacy anonymous id",
      },
      bar: "baz",
    });
  });
  test("page", () => {
    posthog.page({ path: "/foo/ban" });
    expect(capture).toHaveBeenCalledWith("$pageview", { $set_once: {} });
  });
  test("page sets legacy_anonymous_id", () => {
    getLegacyAnonymousId.mockImplementationOnce(
      () => "test legacy anonymous id"
    );
    posthog.page({ path: "?" });
    expect(capture).toHaveBeenCalledWith("$pageview", {
      $set_once: {
        legacy_anonymous_id: "test legacy anonymous id",
      },
    });
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
