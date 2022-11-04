import { act, renderHook } from "@testing-library/react-hooks";

import "../../../__tests__/__helpers__/LocalStorageMock";

import useWebinarWall from "./useWebinarWall";

describe("useWebinarWall", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("shoudShowWall should default to true", () => {
    const { result } = renderHook(useWebinarWall);
    expect(result.current.shouldShowWall).toBe(true);
  });
  test("calling onClick should set shouldShowWall to false", () => {
    const { result } = renderHook(useWebinarWall);
    act(() => {
      result.current.onClick();
    });
    expect(result.current.shouldShowWall).toBe(false);
  });
  test("calling onClick should set oak-webinar-wall-interacted local storage to true", () => {
    expect(window.localStorage.getItem("oak-webinar-wall-interacted")).toBe(
      null
    );
    const { result } = renderHook(useWebinarWall);

    act(() => {
      result.current.onClick();
    });

    expect(window.localStorage.getItem("oak-webinar-wall-interacted")).toBe(
      JSON.stringify(true)
    );
  });
});
