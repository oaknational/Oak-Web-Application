import { renderHook } from "@testing-library/react";

import "../../__tests__/__helpers__/LocalStorageMock";

import useAnonymousId from "./useAnonymousId";

const setAnonymousId = jest.fn();
const mockUseLocalStorage = jest.fn(() => ["", setAnonymousId]);
jest.mock("../../hooks/useLocalStorage", () => ({
  __esModule: true,
  default: (...args: []) => mockUseLocalStorage(...args),
  parseJSON: jest.requireActual("../../hooks/useLocalStorage").parseJSON,
}));
jest.mock("uuid", () => ({
  __esModule: true,
  v4: () => "new-uuid",
}));

const getCookies = jest.fn();
jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: () => getCookies(),
  },
}));

describe("useAnonymousId", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  test("sets new id if no id exists", async () => {
    renderHook(() => useAnonymousId());

    expect(setAnonymousId).toHaveBeenCalledTimes(1);
    expect(setAnonymousId).toHaveBeenCalledWith("new-uuid");
  });
  test("hook does not change id if already exists", async () => {
    mockUseLocalStorage.mockImplementationOnce(() => [
      "already existing id",
      setAnonymousId,
    ]);

    renderHook(() => useAnonymousId());

    expect(setAnonymousId).not.toHaveBeenCalled();
  });
  test("hook returns local storage value", async () => {
    mockUseLocalStorage.mockImplementationOnce(() => [
      "ls-value",
      setAnonymousId,
    ]);

    const { result } = renderHook(() => useAnonymousId());

    expect(result.current).toBe("ls-value");
  });
  test.skip("uses the id from cookies->oakData->userId if present", async () => {
    getCookies.mockReturnValueOnce(
      JSON.stringify({
        userId: "old-anon-id-from-cookies",
      })
    );
    renderHook(() => useAnonymousId());

    expect(setAnonymousId).toHaveBeenCalledTimes(1);
    expect(setAnonymousId).toHaveBeenCalledWith("old-anon-id-from-cookies");
  });
});
