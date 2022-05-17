import React from "react";

import "../src/styles/constants.css";
import "../src/styles/reset.css";
import "../src/styles/globals.css";
import useTheme from "../src/hooks/useTheme";
import { UserStyleContextProvider } from "../src/context/UserStyleContext";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const withThemeProvider = (Story, context) => {
  // pass in context.globals.theme if useTheme() is changed to except theme name
  useTheme();
  return (
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
