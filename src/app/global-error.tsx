"use client";

import {
  OakFlex,
  OakTertiaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { Lexend } from "next/font/google";
import { useMemo } from "react";

import ErrorFallback from "./components/ErrorHandling/ErrorFallback";

import errorReporter from "@/common-lib/error-reporter";

const lexend = Lexend({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const reportError = useMemo(() => errorReporter("app::global-layout"), []);

  return (
    <html lang="en" className={lexend.className}>
      <body style={{ margin: "0px" }}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <OakFlex
            $alignItems="flex-end"
            $justifyContent="center"
            $height="100%"
            $flexDirection="column"
            $mv="spacing-80"
            $width="100%"
            $ph="spacing-100"
          >
            <ErrorFallback
              error={error}
              reset={reset}
              reportError={reportError}
              actionSlot={
                <OakFlex $flexDirection="column" $gap="spacing-24">
                  <OakTertiaryButton
                    onClick={() => globalThis.location.reload()}
                    iconName="retake"
                  >
                    Retry
                  </OakTertiaryButton>
                </OakFlex>
              }
            />
          </OakFlex>
        </OakThemeProvider>
      </body>
    </html>
  );
}
