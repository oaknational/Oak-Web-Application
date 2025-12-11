import { act } from "@testing-library/react";

import { OakToastProvider } from "./OakToastProvider";
import { useOakToastContext } from "./useOakToastContext";

import renderHookWithTheme from "@/__tests__/__helpers__/renderHookWithTheme";

describe("useToastContext", () => {
  test("oakToast properties should  be null by default", () => {
    const { result } = renderHookWithTheme(() => useOakToastContext(), {
      wrapper: OakToastProvider,
    });
    const { currentToastProps } = result.current;

    expect(currentToastProps).toBe(null);
  });
  test("oakToast properties should update  when set", () => {
    const { result } = renderHookWithTheme(() => useOakToastContext(), {
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
