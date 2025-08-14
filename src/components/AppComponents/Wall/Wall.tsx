import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { PropsWithChildren } from "react";

/**
 * Hides content both visually and from AT
 *
 * Intended to enable client-side authorisation while still allowing the content
 * to be spidered
 */
export const Wall = ({ children }: PropsWithChildren) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakBox as="noscript" $position="absolute">
        JavaScript is required to access this content
      </OakBox>
      <OakBox
        id="wall"
        data-testid="content"
        aria-hidden="true"
        $opacity="transparent"
      >
        {children}
      </OakBox>
    </OakThemeProvider>
  );
};
