import usePrereleaseFlag from "./usePrereleaseFlag";

import { mockCookieGet } from "@/utils/mocks";
import { renderHookWithInitialState } from "@/utils/testingLibExt";

describe("usePrereleaseFlag()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be true when enabled", async () => {
    mockCookieGet({ "prerelease.testing.enabled": true });
    const hook = renderHookWithInitialState(() => {
      return usePrereleaseFlag("testing");
    });

    expect(hook.initialResult).toBe(false);
    expect(hook.result.current).toBe(true);
  });

  it("should be false when disabled", async () => {
    mockCookieGet({ "prerelease.testing.enabled": false });
    const hook = renderHookWithInitialState(() => {
      return usePrereleaseFlag("testing");
    });

    expect(hook.initialResult).toBe(false);
    expect(hook.result.current).toBe(false);
  });

  it("should be false when empty", async () => {
    const hook = renderHookWithInitialState(() => {
      return usePrereleaseFlag("testing");
    });

    expect(hook.initialResult).toBe(false);
    expect(hook.result.current).toBe(false);
  });

  it("should be false when invalid", async () => {
    mockCookieGet({ "prerelease.testing.enabled": "foobar" });
    const hook = renderHookWithInitialState(() => {
      return usePrereleaseFlag("testing");
    });

    expect(hook.initialResult).toBe(false);
    expect(hook.result.current).toBe(false);
  });
});
