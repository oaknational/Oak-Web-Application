import React from "react";
import { ThemeProvider } from "styled-components";
import NextImage from "next/image";

import "../src/browser-lib/oak-globals/oakGlobals";
import useOakTheme, { THEME_NAMES } from "../src/hooks/useOakTheme";
import GlobalStyle from "../src/styles/GlobalStyle";

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => {
    return <img {...props} />;
  },
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    // sorts component props into alphbetical order
    sort: "alpha",
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: ["Foundations"],
    },
    // defaults to "docs" view
    viewMode: "docs",
  },
  previewTabs: {
    canvas: {
      hidden: true,
    },
  },
};

const withThemeProvider = (Story, context) => {
  const { theme } = useOakTheme({ overrideTheme: context.globals.theme });
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=ABeeZee&display=swap"
          rel="stylesheet"
        />
        <Story {...context} />
      </ThemeProvider>
    </>
  );
};
export const decorators = [withThemeProvider];

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
