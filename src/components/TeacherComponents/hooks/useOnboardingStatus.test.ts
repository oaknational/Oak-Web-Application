import { act, renderHook } from "@testing-library/react";

import { useOnboardingStatus } from "./useOnboardingStatus";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

describe(useOnboardingStatus, () => {
  it("waits until Clerk has loaded", () => {
    setUseUserReturn(mockLoadingUser);

    const { result, rerender } = renderHook(useOnboardingStatus);

    expect(result.current).toEqual("loading");

    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockLoggedIn.user,
        publicMetadata: { owa: { isOnboarded: false } },
      },
    });

    rerender();

    expect(result.current).toEqual("not-onboarded");
  });

  it("returns `onboarded` when the user has onboarded in OWA", () => {
    setUseUserReturn({ ...mockLoggedIn, user: mockOnboardedUser });

    expect(renderHook(useOnboardingStatus).result.current).toEqual("onboarded");
  });

  it("times out if Clerk doesn't load in 10 seconds", () => {
    jest.useFakeTimers();
    setUseUserReturn(mockLoadingUser);

    const { result } = renderHook(useOnboardingStatus);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current).toEqual("unknown");
  });

  it("updates if Clerk eventually loads", () => {
    jest.useFakeTimers();
    setUseUserReturn(mockLoadingUser);

    const { result, rerender } = renderHook(useOnboardingStatus);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockLoggedIn.user,
        publicMetadata: { owa: { isOnboarded: false } },
      },
    });

    rerender();

    expect(result.current).toEqual("not-onboarded");
  });
});
