import { act, renderHook } from "@testing-library/react";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useWebinarRegistration from "./useWebinarRegistration";

describe("useWebinarRegistration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("webinarLockState should default to 'locked'", () => {
    const { result } = renderHook(useWebinarRegistration);
    expect(result.current.webinarLockState).toBe("locked");
  });
  test("calling onSubmit should set webinarLockState to 'unlocked'", () => {
    const { result } = renderHook(useWebinarRegistration);
    act(() => {
      result.current.webinarRegistrationProps.onSubmit();
    });
    expect(result.current.webinarLockState).toBe("unlocked");
  });
  test("calling onSubmit should set oak-past-webinars-unlocked local storage to true", () => {
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
