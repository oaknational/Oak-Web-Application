import { renderHook, RenderHookOptions } from "@testing-library/react";

import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

export default function renderHookWithTheme<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      {options?.wrapper ? (
        <options.wrapper>{children}</options.wrapper>
      ) : (
        children
      )}
    </OakThemeProvider>
  );

  return renderHook(hook, { ...options, wrapper });
}
