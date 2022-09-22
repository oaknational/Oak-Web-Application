import { renderHook, act } from "@testing-library/react-hooks";

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

  test("showToat should show the toast with message", () => {
    const message = "Some message";

    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    const { showToast } = result.current;
    act(() => {
      showToast(message);
    });

    expect(result.current.shown).toBe(true);
    expect(result.current.message).toEqual(message);
  });
});
