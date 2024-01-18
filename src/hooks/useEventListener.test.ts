import { describe, expect, it } from "vitest";
import { fireEvent, renderHook } from "@testing-library/react";

import useEventListener from "./useEventListener";

declare global {
  interface WindowEventMap {
    "test-event": CustomEvent;
  }

  interface HTMLElementEventMap {
    "test-event": CustomEvent;
  }
}

const addEventListenerToWindow = vi.fn();
window.addEventListener = addEventListenerToWindow;

const windowAddEventListenerSpy = vi.spyOn(window, "addEventListener");
const windowRemoveEventListenerSpy = vi.spyOn(window, "removeEventListener");

const ref = { current: document.createElement("div") };
const refAddEventListenerSpy = vi.spyOn(ref.current, "addEventListener");
const refRemoveEventListenerSpy = vi.spyOn(ref.current, "removeEventListener");

describe("useEventListener()", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should bind the event listener to the window when element is not provided", () => {
    const eventName = "test-event";

    renderHook(() => useEventListener(eventName, vi.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );
  });

  it("should bind the event listener to the element when element is provided", () => {
    const eventName = "test-event";

    renderHook(() => useEventListener(eventName, vi.fn(), ref));

    expect(windowAddEventListenerSpy).not.toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );

    expect(refAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );
  });

  it("should unbind the event listener from the window after the hook is unmounted", () => {
    const eventName = "test-event";

    const { unmount } = renderHook(() => useEventListener(eventName, vi.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );

    unmount();

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );
  });

  it("should unbind the event listener from the element after the hook is unmounted", () => {
    const eventName = "test-event";

    const { unmount } = renderHook(() =>
      useEventListener(eventName, vi.fn(), ref),
    );

    expect(refAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );

    unmount();

    expect(refRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.anything(),
    );
  });

  it("should call the event listener handler when the event is triggered", () => {
    const eventName = "click";
    const handler = vi.fn();

    renderHook(() => useEventListener(eventName, handler, ref));

    fireEvent.click(ref.current);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should have the correct event type", () => {
    const clickHandler = vi.fn();
    const keydownHandler = vi.fn();

    renderHook(() => useEventListener("click", clickHandler, ref));
    renderHook(() => useEventListener("keydown", keydownHandler, ref));

    fireEvent.click(ref.current);
    fireEvent.keyDown(ref.current);

    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(keydownHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });
});
