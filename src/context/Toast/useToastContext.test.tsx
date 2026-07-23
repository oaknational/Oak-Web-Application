import { renderHook, act } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import useToastContext from "./useToastContext";
import ToastProvider from "./ToastProvider";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <ToastProvider>{children}</ToastProvider>
    </OakThemeProvider>
  );
}

describe("useToastContext", () => {
  test("'shown' should default to false", () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: Wrapper,
    });
    const { shown } = result.current;

    expect(shown).toBe(false);
  });

  test("showToast should show the toast with message", () => {
    const message = "Some message";

    const { result } = renderHook(() => useToastContext(), {
      wrapper: Wrapper,
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
