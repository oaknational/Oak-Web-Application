import { act } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { OakNotificationsProvider } from "./OakNotificationsProvider";
import { useOakNotificationsContext } from "./useOakNotificationsContext";

import renderHookWithTheme from "@/__tests__/__helpers__/renderHookWithTheme";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakNotificationsProvider>{children}</OakNotificationsProvider>
    </OakThemeProvider>
  );
}

describe("useToastContext", () => {
  test("oakToast properties should  be null by default", () => {
    const { result } = renderHookWithTheme(() => useOakNotificationsContext(), {
      wrapper: Wrapper,
    });
    const { currentToastProps } = result.current;

    expect(currentToastProps).toBe(null);
  });
  test("oakToast properties should update  when set", () => {
    const { result } = renderHookWithTheme(() => useOakNotificationsContext(), {
      wrapper: Wrapper,
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
