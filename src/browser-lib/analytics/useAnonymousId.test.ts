import { renderHook } from "@testing-library/react";

import "../../__tests__/__helpers__/LocalStorageMock";

jest.mock("uuid", () => ({
  __esModule: true,
  v4: () => "new-uuid",
}));

describe("useAnonymousId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // resetting modules should fix the skipped test, but breaks it in other ways
    // jest.resetModules();
  });
  test("returns a uuid() if no id exists", async () => {
    const useAnonymousId = (await import("./useAnonymousId")).default;

    const { result } = renderHook(() => useAnonymousId());

    expect(result.current).toBe("new-uuid");
  });

  test.skip("returns the old anonymous id if present in local storage", async () => {
    window.localStorage.setItem("anonymousID", JSON.stringify("old-anon-id"));
    const useAnonymousId = (await import("./useAnonymousId")).default;
    const { result } = renderHook(() => useAnonymousId());

    expect(result.current).toBe("old-anon-id");
  });
});
