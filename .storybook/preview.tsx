import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "../src/styles/theme";
import useTheme from "../src/hooks/useTheme";
import { UserStyleContextProvider } from "../src/context/UserStyleContext";
import GlobalStyle from "../src/styles/GlobalStyle";

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
    previewTabs: {
      canvas: { hidden: true },
    },
  },
};

const withThemeProvider = (Story, context) => {
  // pass in context.globals.theme if useTheme() is changed to except theme name
  useTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <UserStyleContextProvider>
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@300&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=ABeeZee&display=swap"
            rel="stylesheet"
          />
          <Story {...context} />
        </UserStyleContextProvider>
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
    defaultValue: "defaultTheme",
    toolbar: {
      icon: "circlehollow",
      // Array of plain string values or MenuItem shape (see below)
      items: ["pupil", "teacher"],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};
