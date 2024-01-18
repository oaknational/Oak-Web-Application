import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import useBugSnag from "./useBugsnag";

vi.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: { _client: false },
}));

const initialiseBugsnag = vi.fn();
vi.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: (...args: unknown[]) => initialiseBugsnag(...args),
}));

describe("useBugSnag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should call initialiseBugsnag() with the correct gleap config", () => {
    const initialArgs = { enabled: true, userId: "not_a_user" };
    renderHook(() => useBugSnag(initialArgs));

    expect(initialiseBugsnag).toHaveBeenCalledWith(initialArgs.userId);
  });
  it.todo("should set userId on Bugsnag");
  it.todo("should get paused if consent revoked");
});
