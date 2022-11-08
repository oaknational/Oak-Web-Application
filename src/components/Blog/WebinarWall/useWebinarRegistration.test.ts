import { act, renderHook } from "@testing-library/react-hooks";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useWebinarRegistration from "./useWebinarRegistration";

describe("useWebinarRegistration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("webinarsUnlocked should default to false", () => {
    const { result } = renderHook(useWebinarRegistration);
    expect(result.current.webinarsUnlocked).toBe(false);
  });
  test("calling onSubmit should set webinarsUnlocked to true", () => {
    const { result } = renderHook(useWebinarRegistration);
    act(() => {
      result.current.onSubmit();
    });
    expect(result.current.webinarsUnlocked).toBe(true);
  });
  test("calling onSubmit should set oak-past-webinars-unlocked local storage to true", () => {
    expect(window.localStorage.getItem("oak-past-webinars-unlocked")).toBe(
      null
    );
    const { result } = renderHook(useWebinarRegistration);

    act(() => {
      result.current.onSubmit();
    });

    expect(window.localStorage.getItem("oak-past-webinars-unlocked")).toBe(
      JSON.stringify(true)
    );
  });
});
