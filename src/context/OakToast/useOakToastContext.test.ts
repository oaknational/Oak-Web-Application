import { act, renderHook } from "@testing-library/react";

import { OakToastProvider } from "./OakToastProvider";
import { useOakToastContext } from "./useOakToastContext";

describe("useToastContext", () => {
  test("oakToast properties should  be null by default", () => {
    const { result } = renderHook(() => useOakToastContext(), {
      wrapper: OakToastProvider,
    });
    const { currentToastProps } = result.current;

    expect(currentToastProps).toBe(null);
  });
  test("oakToast properties should update  when set", () => {
    const { result } = renderHook(() => useOakToastContext(), {
      wrapper: OakToastProvider,
    });
    const { setCurrentToastProps } = result.current;

    act(() =>
      setCurrentToastProps({
        message: "Test message",
        variant: "aqua",
        showIcon: true,
        autoDismiss: true,
      }),
    );

    expect(result.current.currentToastProps).toEqual({
      message: "Test message",
      variant: "aqua",
      showIcon: true,
      autoDismiss: true,
    });
  });
});
