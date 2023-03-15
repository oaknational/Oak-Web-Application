import getLegacyAnonymousId from "./getLegacyAnonymousId";

const getCookies = jest.fn();
jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: () => getCookies(),
  },
}));

describe("getLegacyAnonymousId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  test("returns cookie value if exists", () => {
    getCookies.mockReturnValueOnce(
      JSON.stringify({
        userId: "old-anon-id-from-cookies",
      })
    );
    const anonymousId = getLegacyAnonymousId();

    expect(getCookies).toHaveBeenCalledTimes(1);
    expect(anonymousId).toBe("old-anon-id-from-cookies");
  });
  test("else (defaults) to generating a null", () => {
    const anonymousId = getLegacyAnonymousId();

    expect(anonymousId).toBe(null);
  });
});
