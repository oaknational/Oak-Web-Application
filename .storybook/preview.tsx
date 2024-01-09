import React from "react";
import { ThemeProvider } from "styled-components";
import NextImage from "next/image";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

import "../src/browser-lib/oak-globals/oakGlobals";
import useOakTheme, { THEME_NAMES } from "../src/hooks/useOakTheme";
import GlobalStyle from "../src/styles/GlobalStyle";
import SpriteSheet from "../src/components/SharedComponents/SpriteSheet";
import InlineSpriteSheet from "../src/components/InlineSpriteSheet";

export const OriginalNextImage = (props) => {
  return (
    <NextImage
      {...props}
      unoptimized={props.unoptimized !== undefined ? props.unoptimized : true}
    />
  );
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    sort: "alpha",
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: "alphabetical",
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

// Custom hook to provide theme
export const useThemeProvider = (Story, context) => {
  const { theme } = useOakTheme({ overrideTheme: context.globals.theme });

  return () => (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <link
        href="https://googleapis-fonts.thenational.academy/css2?family=Lexend:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <Story {...context} />
      <SpriteSheet />
      <InlineSpriteSheet />
    </ThemeProvider>
  );
};

// Updated usage of the custom hook in decorators
export const decorators = [
  (Story, context) => {
    const ThemedStory = useThemeProvider(Story, context);
    return <ThemedStory />;
  },
];

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "default",
    toolbar: {
      icon: "circlehollow",
      items: THEME_NAMES,
      showName: true,
    },
  },
};

export default {
  OriginalNextImage: OriginalNextImage,
  decorators: decorators,
  parameters: parameters,
  globalTypes: globalTypes,
};
