/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend } from "next/font/google";
import parse from "html-react-parser";

import { PHProvider } from "./providers";
import StyledComponentsRegistry from "./styles-registry";
import AnalyticsWrapper from "./components/AnalyticsWrapper";

import "@/styles/app-global.css";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@/styles/oakThemeApp";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import { FAVICON_LINKS_HEAD_INNER_HTML } from "@/image-data";

export const metadata = {
  title: "Oak National Academy",
  description:
    "Browse and download Oak National Academy's lesson planning resources, find curriculum plans, and explore our AI lesson assistant - all completely free.",
};
const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.className}>
      {parse(FAVICON_LINKS_HEAD_INNER_HTML)}
      <body style={{ margin: "0px" }}>
        <StyledComponentsRegistry>
          <PHProvider>
            <OakThemeProvider theme={oakDefaultTheme}>
              <CookieConsentProvider>
                <ClerkProvider
                  signInUrl={"/sign-in"}
                  signUpUrl={"/sign-in"}
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
                  <AnalyticsWrapper>
                    <OakBox $width="100vw" $height="100vh">
                      {children}
                    </OakBox>
                  </AnalyticsWrapper>
                </ClerkProvider>
              </CookieConsentProvider>
            </OakThemeProvider>
          </PHProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
