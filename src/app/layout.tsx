/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend } from "next/font/google";

import { PHProvider } from "./providers";
import StyledComponentsRegistry from "./styles-registry";

import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@/styles/oakThemeApp";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import GlobalStyle from "@/styles/GlobalStyle";

export const metadata = {
  title: "Oak National Academy",
  description:
    "Browse and download Oak National Academy's lesson planning resources, find curriculum plans, and explore our AI lesson assistant - all completely free.",
};
const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GlobalStyle fontFamily={lexend.style.fontFamily} />
      <body style={{ margin: "0px" }}>
        <StyledComponentsRegistry>
          <PHProvider>
            <OakThemeProvider theme={oakDefaultTheme}>
              <CookieConsentProvider>
                <ClerkProvider
                  localization={{
                    signUp: {
                      start: {
                        title: "Sign up to Oak in seconds",
                        subtitle: "Choose a method",
                      },
                    },
                  }}
                  appearance={{
                    variables: {
                      colorPrimary: "#222222",
                      fontFamily: lexend.style.fontFamily,
                      borderRadius: "4px",
                    },
                    elements: {
                      cardBox: {
                        boxShadow: "none",
                        overflow: "auto",
                        borderRadius: "8px",
                      },
                      card: {
                        paddingBlock: "40px",
                        boxShadow: "none",
                        borderRadius: "8px",
                      },
                      footer: {
                        background: "#ffffff",
                      },
                    },
                  }}
                >
                  <OakBox $width="100vw" $height="100vh">
                    {children}
                  </OakBox>
                </ClerkProvider>
              </CookieConsentProvider>
            </OakThemeProvider>
          </PHProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
