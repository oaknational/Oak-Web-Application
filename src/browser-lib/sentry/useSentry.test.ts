import { renderHook } from "@testing-library/react";
import * as Sentry from "@sentry/nextjs";

import useSentry, { isSentryInitialised } from "./useSentry";

import { initialiseSentry } from "@/common-lib/error-reporter";

jest.mock("@sentry/nextjs", () => ({
  getClient: jest.fn(),
  setUser: jest.fn(),
  endSession: jest.fn(),
}));

jest.mock("@/common-lib/error-reporter", () => ({
  initialiseSentry: jest.fn(),
}));

describe("useSentry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialise Sentry when enabled and not already initialised", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue(undefined);
    const userId = "test-user-123";

    renderHook(() => useSentry({ enabled: true, userId }));

    expect(initialiseSentry).toHaveBeenCalledWith(userId);
  });

  it("should not initialise Sentry when already initialised", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue({});
    const userId = "test-user-123";

    renderHook(() => useSentry({ enabled: true, userId }));

    expect(initialiseSentry).not.toHaveBeenCalled();
  });

  it("should not initialise Sentry when disabled", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue(undefined);
    const userId = "test-user-123";

    renderHook(() => useSentry({ enabled: false, userId }));

    expect(initialiseSentry).not.toHaveBeenCalled();
  });

  it("should update Sentry user when userId changes and Sentry is initialised", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue({});
    const userId = "test-user-123";

    renderHook(() => useSentry({ enabled: true, userId }));

    expect(Sentry.setUser).toHaveBeenCalledWith({ id: userId });
  });

  it("should end Sentry session when disabled and Sentry is initialised", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue({});

    const { rerender } = renderHook(
      ({ enabled }) => useSentry({ enabled, userId: "test-user-123" }),
      { initialProps: { enabled: true } },
    );

    // Simulate disabling Sentry
    rerender({ enabled: false });

    expect(Sentry.endSession).toHaveBeenCalled();
  });

  it("should handle undefined userId", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue({});

    renderHook(() => useSentry({ enabled: true, userId: null }));

    expect(Sentry.setUser).not.toHaveBeenCalled();
  });
});

describe("isSentryInitialised", () => {
  it("should return true when Sentry client exists", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue({});

    expect(isSentryInitialised()).toBe(true);
  });

  it("should return false when Sentry client does not exist", () => {
    (Sentry.getClient as jest.Mock).mockReturnValue(undefined);

    expect(isSentryInitialised()).toBe(false);
  });
});
