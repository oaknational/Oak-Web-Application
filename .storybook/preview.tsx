import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { fn, sb } from "storybook/test";
import { Lexend } from "next/font/google";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { OakGlobalStyle, parseColor } from "@oaknational/oak-components";

import "../src/browser-lib/oak-globals/oakGlobals";
import GlobalStyle from "../src/styles/GlobalStyle";
import SpriteSheet from "../src/components/SharedComponents/SpriteSheet";
import InlineSpriteSheet from "../src/components/GenericPagesComponents/InlineSpriteSheet";
import theme from "../src/styles/theme";

import "./jest-mock";
import {
  oakDarkTheme,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { Decorator, ReactRenderer } from "@storybook/nextjs";

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

  docs: {
    codePanel: true,
  },

  nextjs: {
    appDirectory: true,
  },
};

export const OakThemeStyle = createGlobalStyle<{ theme: string }>`
  body, .docs-story, .sbdocs-preview {
    background-color: ${({ theme }) => {
      return parseColor(theme === "dark" ? "black" : "white");
    }}
  }
`;

const globalDecorator: Decorator = (Story, context) => {
  return (
    <ThemeProvider theme={{ ...theme }}>
      <OakThemeProvider
        theme={
          context.globals.theme === "default" ? oakDefaultTheme : oakDarkTheme
        }
      >
        <GlobalStyle fontFamily={lexend.style.fontFamily} />
        <OakThemeStyle theme={context.globals.theme} />
        <div className={lexend.variable}>
          <Story {...context} />
        </div>
        <SpriteSheet />
        <InlineSpriteSheet />
      </OakThemeProvider>
    </ThemeProvider>
  );
};
export const decorators = [
  withThemeFromJSXProvider<ReactRenderer>({
    themes: {
      default: oakDefaultTheme,
      dark: oakDarkTheme,
    },
    defaultTheme: "default",
    Provider: ThemeProvider,
    GlobalStyles: OakGlobalStyle,
  }),
  globalDecorator,
];

export const globalTypes = {};
export const tags = ["autodocs", "autodocs", "autodocs"];

// spy on useUnitDownloadExistence check in stories so the return value can be mocked
sb.mock(
  import(
    "../src/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck.tsx"
  ),
  { spy: true },
);
