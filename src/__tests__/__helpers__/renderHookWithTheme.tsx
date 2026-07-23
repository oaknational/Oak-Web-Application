import { renderHook, RenderHookOptions } from "@testing-library/react";

export default function renderHookWithTheme<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <>
      {options?.wrapper ? (
        <options.wrapper>{children}</options.wrapper>
      ) : (
        children
      )}
    </>
  );

  return renderHook(hook, { ...options, wrapper });
}
