import { renderHook, act } from "@testing-library/react";

import useToastContext from "./useToastContext";
import ToastProvider from "./ToastProvider";

describe("useToastContext", () => {
  it("'shown' should default to false", () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    const { shown } = result.current;

    expect(shown).toBe(false);
  });

  it("showToast should show the toast with message", () => {
    const message = "Some message";

    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    const { showToast } = result.current;
    act(() => {
      showToast(message, "alert");
    });

    expect(result.current.shown).toBe(true);
    expect(result.current.message).toEqual(message);
  });

  it("it should throw an error if called outside of toast provider", () => {
    expect(() => {
      renderHook(() => useToastContext());
    }).toThrow(Error("useToastContext called outside of toast provider"));
  });
});
