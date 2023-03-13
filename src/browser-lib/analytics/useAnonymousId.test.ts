import { renderHook } from "@testing-library/react";

import "../../__tests__/__helpers__/LocalStorageMock";

import useAnonymousId from "./useAnonymousId";

const setLegacyCookieIfNotPresent = jest.fn();
jest.mock("./setLegacyCookieIfNotPresent", () => ({
  __esModule: true,
  default: (...args: []) => setLegacyCookieIfNotPresent(...args),
}));
// const getOrGenerateAnonymousId = jest.fn();
jest.mock("./getOrGenerateAnonymousId", () => ({
  __esModule: true,
  default: jest.fn(() => "anonymous-id-mock-value"),
}));

const setAnonymousId = jest.fn();
const mockUseLocalStorage = jest.fn(() => ["", setAnonymousId]);
jest.mock("../../hooks/useLocalStorage", () => ({
  __esModule: true,
  default: (...args: []) => mockUseLocalStorage(...args),
  parseJSON: jest.requireActual("../../hooks/useLocalStorage").parseJSON,
}));

const posthogSetAnonymousId = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    posthogSetAnonymousId: (...args: []) => posthogSetAnonymousId(...args),
  }),
}));

describe("useAnonymousId", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  test("sets new id if no id exists", async () => {
    renderHook(() => useAnonymousId());

    expect(setAnonymousId).toHaveBeenCalledTimes(1);
    expect(setAnonymousId).toHaveBeenCalledWith("anonymous-id-mock-value");
  });
  test("sets legacy cookie if not present", async () => {
    renderHook(() => useAnonymousId());
    expect(setLegacyCookieIfNotPresent).toHaveBeenCalledTimes(1);
    expect(setLegacyCookieIfNotPresent).toHaveBeenCalledWith({
      anonymousId: "anonymous-id-mock-value",
    });
  });
  test("calls analytics.posthogSetAnonymousId()", async () => {
    renderHook(() => useAnonymousId());

    expect(posthogSetAnonymousId).toHaveBeenCalledTimes(1);
    expect(posthogSetAnonymousId).toHaveBeenCalledWith(
      "anonymous-id-mock-value"
    );
  });
  test("returns anonymous id", async () => {
    const { result } = renderHook(() => useAnonymousId());

    expect(result.current).toBe("anonymous-id-mock-value");
  });
});
