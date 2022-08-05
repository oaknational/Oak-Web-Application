import hubspot from "./hubspot";

const qPush = jest.fn();
const pPush = jest.fn();

describe("hubspot.ts", () => {
  beforeEach(() => {
    window._hsq = { push: qPush };
    window._hsp = { push: pPush };
    jest.clearAllMocks();
  });
  test("identify", () => {
    hubspot.identify("123", { email: "abc" });
    expect(qPush).toHaveBeenCalledWith([
      "identify",
      { id: "123", email: "abc" },
    ]);
  });
  test("page", () => {
    hubspot.page();
    expect(qPush).toHaveBeenCalledWith(["trackPageView"]);
  });
  test("track", () => {
    hubspot.track("my-event", { foo: "bar" });
    expect(qPush).toHaveBeenCalledWith([
      "trackEvent",
      { id: "my-event", foo: "bar" },
    ]);
  });
  test("optIn", () => {
    hubspot.optIn();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack", { track: true }]);
    expect(pPush).toHaveBeenCalledWith(["revokeCookieConsent"]);
  });
  test("optOut", () => {
    hubspot.optOut();
    expect(qPush).toHaveBeenCalledWith(["doNotTrack"]);
  });
  test("loaded", () => {
    expect(hubspot.loaded()).toBe(false);
  });
});
