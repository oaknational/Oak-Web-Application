import supportedBrowsersRegexp from "./supportedBrowsersRegexp";

const IE11_UA = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
const SAFARI_15_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15";
const ULTRA_MODERN_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/999.99 (KHTML, like Gecko) Chrome/999.9.9.9 Safari/999.99";

describe("supportedBrowsersRegexp", () => {
  it("rejects obviously unsupported user agents", () => {
    expect(supportedBrowsersRegexp.test(IE11_UA)).toBe(false);
    expect(supportedBrowsersRegexp.test(SAFARI_15_UA)).toBe(false);
  });

  it("matches supported user agents", () => {
    expect(supportedBrowsersRegexp.test(ULTRA_MODERN_CHROME_UA)).toBe(true);
  });
});
