import { renderHook } from "@testing-library/react";

import useTrackExitIntended from "./usetrackExitIntended";

import useAnalytics from "@/context/Analytics/useAnalytics";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseAnalytics = jest.mocked(useAnalytics);

describe("useTrackExitIntended()", () => {
  const exitIntended = jest.fn();

  beforeEach(() => {
    mockUseAnalytics.mockReturnValue({
      track: {
        exitIntended,
      },
    } as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("registers a mouseout listener on mount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    renderHook(() => useTrackExitIntended());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseout",
      expect.any(Function),
    );
  });

  test("removes the mouseout listener on unmount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useTrackExitIntended());

    const mouseoutListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mouseout",
    )?.[1];

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseout",
      mouseoutListener,
    );
  });

  test("tracks exit intent when cursor leaves through the top of viewport", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    renderHook(() => useTrackExitIntended());

    const mouseoutListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mouseout",
    )?.[1] as (event: MouseEvent) => void;

    const event = new MouseEvent("mouseout", { clientY: 0 });
    Object.defineProperty(event, "relatedTarget", { value: null });

    mouseoutListener(event);

    expect(exitIntended).toHaveBeenCalledTimes(1);
  });

  test("does not track exit intent when cursor does not leave through the top", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    renderHook(() => useTrackExitIntended());

    const mouseoutListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mouseout",
    )?.[1] as (event: MouseEvent) => void;

    const event = new MouseEvent("mouseout", { clientY: 10 });
    Object.defineProperty(event, "relatedTarget", { value: null });

    mouseoutListener(event);

    expect(exitIntended).not.toHaveBeenCalled();
  });

  test("does not track exit intent when relatedTarget exists", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    renderHook(() => useTrackExitIntended());

    const mouseoutListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mouseout",
    )?.[1] as (event: MouseEvent) => void;

    const event = new MouseEvent("mouseout", { clientY: 0 });
    Object.defineProperty(event, "relatedTarget", {
      value: document.createElement("div"),
    });

    mouseoutListener(event);

    expect(exitIntended).not.toHaveBeenCalled();
  });
});
