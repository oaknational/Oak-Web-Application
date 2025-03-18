import React from "react";
import { ThemeProvider } from "styled-components";
import * as NextImage from "next/image";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { fn } from "@storybook/test";
import { Lexend } from "next/font/google";
import "./jest-mock";

import "../src/browser-lib/oak-globals/oakGlobals";
import useOakTheme, { THEME_NAMES } from "../src/hooks/useOakTheme";
import GlobalStyle from "../src/styles/GlobalStyle";
import SpriteSheet from "../src/components/SharedComponents/SpriteSheet";
import InlineSpriteSheet from "../src/components/GenericPagesComponents/InlineSpriteSheet";

const OriginalNextImage = NextImage.default;
// @ts-ignore
OriginalNextImage.defaultProps = {
  unoptimized: true,
};

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const parameters = {
  actions: {
    // 👇 Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
    args: { onClick: fn(), onSubmit: fn() },
  },
  controls: {
    // sorts component props into alphabetical order
    sort: "alpha",
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: "alphabetical",
      // Leave "Introduction" first so that user lands there
      order: ["Introduction"],
    },
  },
  viewMode: "docs",
  previewTabs: {
    canvas: {
      hidden: true,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

const WithThemeProvider = (Story, context) => {
  const { theme } = useOakTheme({ overrideTheme: context.globals.theme });
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle fontFamily={lexend.style.fontFamily} />
      <div className={lexend.variable}>
        <Story {...context} />
      </div>
      <SpriteSheet />
      <InlineSpriteSheet />
    </ThemeProvider>
  );
};
export const decorators = [WithThemeProvider];

export const globalTypes = {
  // This will show in UI but not change theme until hook is updated and can take a theme string
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "default",
    toolbar: {
      icon: "circlehollow",
      // Array of plain string values or MenuItem shape (see below)
      items: THEME_NAMES,
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};
export const tags = ["autodocs", "autodocs", "autodocs"];
