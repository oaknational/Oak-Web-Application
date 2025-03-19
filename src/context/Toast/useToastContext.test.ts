import { renderHook, act } from "@testing-library/react";

import useToastContext from "./useToastContext";
import ToastProvider from "./ToastProvider";

describe("useToastContext", () => {
  test("'shown' should default to false", () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    const { shown } = result.current;

    expect(shown).toBe(false);
  });

  test("showToast should show the toast with message", () => {
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

  test("it should throw an error if called outside of toast provider", () => {
    console.error = jest.fn();
    expect(() => {
      renderHook(() => useToastContext());
    }).toThrow(Error("useToastContext called outside of toast provider"));
    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: expect.stringContaining(
          "useToastContext called outside of toast provider",
        ),
      }),
    );
    expect(console.error).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        message: expect.stringContaining(
          "useToastContext called outside of toast provider",
        ),
      }),
    );
    expect(console.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(
        "The above error occurred in the <TestComponent> component",
      ),
    );
  });
});
