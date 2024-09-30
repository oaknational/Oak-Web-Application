/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend } from "next/font/google";

import { PHProvider } from "./providers";

import {
  OakGlobalStyle,
  OakThemeProvider,
  oakDefaultTheme,
} from "@/styles/oakThemeApp";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

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
        <PHProvider>
          <OakThemeProvider theme={oakDefaultTheme}>
            <CookieConsentProvider>
              <ClerkProvider
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
            </CookieConsentProvider>
          </OakThemeProvider>
        </PHProvider>
      </body>
    </html>
  );
}
