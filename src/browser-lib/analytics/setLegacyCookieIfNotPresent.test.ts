import setLegacyCookieIfNotPresent from "./setLegacyCookieIfNotPresent";

const getCookies = jest.fn();
const setCookies = jest.fn();
jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: () => getCookies(),
    set: (...args: []) => setCookies(...args),
  },
}));

describe("setLegacyCookieIfNotPresent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("sets cookie of not present", () => {
    setLegacyCookieIfNotPresent({
      anonymousId: "my-anon-id",
    });

    expect(setCookies).toHaveBeenCalledTimes(1);
    expect(setCookies).toHaveBeenCalledWith(
      "oakData",
      '{"userId":"my-anon-id"}',
      expect.objectContaining({ sameSite: "lax" })
    );
  });
  test("does not set cookie if present", () => {
    getCookies.mockReturnValueOnce(
      JSON.stringify({
        userId: "old-anon-id-from-cookies",
      })
    );
    setLegacyCookieIfNotPresent({ anonymousId: "my-anon-id" });

    expect(setCookies).not.toHaveBeenCalled();
  });
});
