import { LS_KEY_ANONYMOUS_ID } from "../../config/localStorageKeys";
import "../../__tests__/__helpers__/LocalStorageMock";

import getOrGenerateAnonymousId, {
  OLD_ANONYMOUS_ID_KEY,
} from "./getOrGenerateAnonymousId";

jest.mock("uuid", () => ({
  __esModule: true,
  v4: () => "new-uuid-v4",
}));

const getCookies = jest.fn();
jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: () => getCookies(),
  },
}));

describe("getOrGenerateAnonymousId", () => {
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
    const anonymousId = getOrGenerateAnonymousId();

    expect(getCookies).toHaveBeenCalledTimes(1);
    expect(anonymousId).toBe("old-anon-id-from-cookies");
  });
  test("else returns new ls value if exists", () => {
    localStorage.setItem(LS_KEY_ANONYMOUS_ID, JSON.stringify("new-ls-anon-id"));
    const anonymousId = getOrGenerateAnonymousId();

    expect(anonymousId).toBe("new-ls-anon-id");
  });
  test("else returns old ls value if exists", () => {
    localStorage.setItem(
      OLD_ANONYMOUS_ID_KEY,
      JSON.stringify("old-ls-anon-id")
    );
    const anonymousId = getOrGenerateAnonymousId();

    expect(anonymousId).toBe("old-ls-anon-id");
  });
  test("else (defaults) to generating a new uuid", () => {
    const anonymousId = getOrGenerateAnonymousId();

    expect(anonymousId).toBe("new-uuid-v4");
  });
});
