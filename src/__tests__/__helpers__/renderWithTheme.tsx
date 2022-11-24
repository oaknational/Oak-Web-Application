/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { DefaultTheme, ThemeProvider } from "styled-components";

import "../../browser-lib/oak-globals/oakGlobals";
import defaultTheme from "../../styles/theme";

export type ProviderProps = {
  children?: React.ReactNode;
  theme?: Partial<DefaultTheme>;
};

export const AllTheProviders: FC<ProviderProps> = ({ children, theme }) => {
  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
      {children}
    </ThemeProvider>
  );
};

const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  providerProps?: ProviderProps
) => {
  const wrapper: FC = (props) => (
    <AllTheProviders {...props} {...providerProps} />
  );
  return render(ui, { wrapper, ...options });
};

export default renderWithTheme;
