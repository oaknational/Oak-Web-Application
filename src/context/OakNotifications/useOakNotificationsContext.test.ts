import { act } from "@testing-library/react";

import { OakNotificationsProvider } from "./OakNotificationsProvider";
import { useOakNotificationsContext } from "./useOakNotificationsContext";

import renderHookWithTheme from "@/__tests__/__helpers__/renderHookWithTheme";

describe("useToastContext", () => {
  test("oakToast properties should  be null by default", () => {
    const { result } = renderHookWithTheme(() => useOakNotificationsContext(), {
      wrapper: OakNotificationsProvider,
    });
    const { currentToastProps } = result.current;

    expect(currentToastProps).toBe(null);
  });
  test("oakToast properties should update  when set", () => {
    const { result } = renderHookWithTheme(() => useOakNotificationsContext(), {
      wrapper: OakNotificationsProvider,
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
