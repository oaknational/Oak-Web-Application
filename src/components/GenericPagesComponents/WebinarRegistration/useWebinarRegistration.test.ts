import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useWebinarRegistration from "./useWebinarRegistration";

import "@/__tests__/__helpers__/LocalStorageMock";

describe("useWebinarRegistration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("webinarLockState should default to 'locked'", () => {
    const { result } = renderHook(useWebinarRegistration);
    expect(result.current.webinarLockState).toBe("locked");
  });
  it("calling onSubmit should set webinarLockState to 'unlocked'", () => {
    const { result } = renderHook(useWebinarRegistration);
    act(() => {
      result.current.webinarRegistrationProps.onSubmit();
    });
    expect(result.current.webinarLockState).toBe("unlocked");
  });
  it("calling onSubmit should set oak-past-webinars-unlocked local storage to true", () => {
    expect(window.localStorage.getItem("oak-past-webinars-unlocked")).toBe(
      null,
    );
    const { result } = renderHook(useWebinarRegistration);

    act(() => {
      result.current.webinarRegistrationProps.onSubmit();
    });

    expect(window.localStorage.getItem("oak-past-webinars-unlocked")).toBe(
      JSON.stringify(true),
    );
  });
});
