import React from "react";
import { ThemeProvider } from "styled-components";
import * as NextImage from "next/image";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { Lexend } from "next/font/google";

import "../src/browser-lib/oak-globals/oakGlobals";
import useOakTheme, { THEME_NAMES } from "../src/hooks/useOakTheme";
import GlobalStyle from "../src/styles/GlobalStyle";
import SpriteSheet from "../src/components/SharedComponents/SpriteSheet";
import InlineSpriteSheet from "../src/components/GenericPagesComponents/InlineSpriteSheet";

const OriginalNextImage = NextImage.default;
// @ts-ignore
OriginalNextImage.propTypes = {
  unoptimized: null,
};
// @ts-ignore
OriginalNextImage.defaultProps = {
  unoptimized: true,
};

// This causes error 'cannot redefine property: default'
// Object.defineProperty(NextImage, "default", {
//   configurable: true,
//   value: (props) => <OriginalNextImage {...props} unoptimized />,
// });

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

const lexend = Lexend({ subsets: ["latin"] });

const withThemeProvider = (Story, context) => {
  const { theme } = useOakTheme({ overrideTheme: context.globals.theme });
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle fontFamily={lexend.style.fontFamily} />
        <>
          <style jsx global>{`
            html {
              font-family: ${lexend.style.fontFamily};
            }
          `}</style>
        </>
        <Story {...context} />
        <SpriteSheet />
        <InlineSpriteSheet />
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
