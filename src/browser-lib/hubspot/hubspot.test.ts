import { describe, expect, it } from "vitest";

import { hubspotWithoutQueue as hubspot } from "./hubspot";

const reportError = vi.fn();
vi.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const qPush = vi.fn();
const pPush = vi.fn();

describe("hubspot.ts", () => {
  beforeEach(() => {
    window._hsq = { push: qPush };
    window._hsp = { push: pPush };
    vi.clearAllMocks();
  });
  afterEach(() => {
    window._hsq = undefined;
    window._hsp = undefined;
  });
  it("identify", () => {
    hubspot.identify("123", { email: "abc" });
    expect(qPush).toHaveBeenCalledWith([
      "identify",
      { id: "123", email: "abc" },
    ]);
  });
  it("identify without email", () => {
    hubspot.identify("123", {});
    expect(reportError).toHaveBeenCalled();
    expect(qPush).toHaveBeenCalledWith(["identify", { id: "123" }]);
  });
  it("page", () => {
    hubspot.page({ path: "/foo/ban" });
    expect(qPush).toHaveBeenCalledWith(["setPath", "/foo/ban"]);
    expect(qPush).toHaveBeenCalledWith(["trackPageView"]);
  });
  it("track", () => {
    hubspot.track("my-event", { foo: "bar" });
    expect(qPush).toHaveBeenCalledWith([
      "trackEvent",
      { id: "my-event", foo: "bar" },
    ]);
  });
  it("track: with id in properties should error", () => {
    hubspot.track("my-event", { foo: "bar", id: "123-oops-456" });
    expect(reportError).toHaveBeenCalled();
    expect(qPush).toHaveBeenCalledWith([
      "trackEvent",
      { id: "my-event", foo: "bar" },
    ]);
  });
  it("optIn", () => {
    hubspot.optIn();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack", { track: true }]);
  });
  it("optOut", () => {
    hubspot.optOut();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack"]);
    expect(pPush).toHaveBeenCalledWith(["revokeCookieConsent"]);
  });
});
