import { hubspotWithoutQueue as hubspot } from "./hubspot";

const reportError = jest.fn();
jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const qPush = jest.fn();
const pPush = jest.fn();

describe("hubspot.ts", () => {
  beforeEach(() => {
    window._hsq = { push: qPush };
    window._hsp = { push: pPush };
    jest.clearAllMocks();
  });
  afterEach(() => {
    window._hsq = undefined;
    window._hsp = undefined;
  });
  test("identify", () => {
    hubspot.identify("123", { email: "abc" });
    expect(qPush).toHaveBeenCalledWith([
      "identify",
      { id: "123", email: "abc" },
    ]);
  });
  test("identify without email", () => {
    hubspot.identify("123", {});
    expect(reportError).toHaveBeenCalled();
    expect(qPush).toHaveBeenCalledWith(["identify", { id: "123" }]);
  });
  test("page", () => {
    hubspot.page({ path: "/foo/ban" });
    expect(qPush).toHaveBeenCalledWith(["setPath", "/foo/ban"]);
    expect(qPush).toHaveBeenCalledWith(["trackPageView"]);
  });
  test("track", () => {
    hubspot.track("my-event", { foo: "bar" });
    expect(qPush).toHaveBeenCalledWith([
      "trackEvent",
      { id: "my-event", foo: "bar" },
    ]);
  });
  test("track: with id in properties should error", () => {
    hubspot.track("my-event", { foo: "bar", id: "123-oops-456" });
    expect(reportError).toHaveBeenCalled();
    expect(qPush).toHaveBeenCalledWith([
      "trackEvent",
      { id: "my-event", foo: "bar" },
    ]);
  });
  test("optIn", () => {
    hubspot.optIn();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack", { track: true }]);
  });
  test("optOut", () => {
    hubspot.optOut();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack"]);
    expect(pPush).toHaveBeenCalledWith(["revokeCookieConsent"]);
  });
});
