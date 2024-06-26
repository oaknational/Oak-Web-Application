import { getPrereleaseFlag } from "./getPrereleaseFlag";

function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${JSON.stringify(val)}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  jest.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}

const DISABLE_LOGGING = true;

describe("usePrereleaseFlag()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("true", async () => {
    const cookies = { "prerelease.foo.bar.enabled": true };

    mockCookieGet(cookies);

    const current = getPrereleaseFlag("foo.bar", {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["prerelease.foo.bar.enabled"]);
  });

  test("false", async () => {
    const cookies = { "prerelease.foo.bar.enabled": false };
    mockCookieGet(cookies);

    const current = getPrereleaseFlag("foo.bar", {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["prerelease.foo.bar.enabled"]);
  });

  test("invalid", async () => {
    const cookies = { "prerelease.foo.bar.enabled": "testing" };
    mockCookieGet(cookies);

    const current = getPrereleaseFlag("foo.bar", {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(false);
  });

  test("missing", async () => {
    const cookies = {};
    mockCookieGet(cookies);

    const current = getPrereleaseFlag("foo.bar", {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(false);
  });
});
