/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend } from "next/font/google";

import { PHProvider } from "./providers";
import StyledComponentsRegistry from "./styles-registry";

import {
  OakGlobalStyle,
  OakThemeProvider,
  oakDefaultTheme,
} from "@/styles/oakThemeApp";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider from "@/context/Analytics/AnalyticsProvider";
import { MenuProvider } from "@/context/Menu";

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
    <html lang="en" className={lexend.className}>
      <OakGlobalStyle />
      <body style={{ margin: "0px" }}>
        <StyledComponentsRegistry>
          <PHProvider>
            <OakThemeProvider theme={oakDefaultTheme}>
              <CookieConsentProvider>
                <AnalyticsProvider>
                  <MenuProvider>
                    <ClerkProvider
                      localization={{
                        signUp: {
                          start: {
                            subtitle: "Sign up to Oak to continue",
                            title: "Create a free account",
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
                      {children}
                    </ClerkProvider>
                  </MenuProvider>
                </AnalyticsProvider>
              </CookieConsentProvider>
            </OakThemeProvider>
          </PHProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
