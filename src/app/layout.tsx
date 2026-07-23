/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend } from "next/font/google";
import parse from "html-react-parser";
import { Metadata } from "next";

import { PHProvider } from "./providers";
import StyledComponentsRegistry from "./styles-registry";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import { getTwitterMetadata, getOpenGraphMetadata } from "./metadata";
import { SimulateErrorControls } from "./components/ErrorHandling/SimulateErrorControls";

import "@/styles/app-global.css";
import "@/browser-lib/gleap/gleap.css";
import AppHooks from "@/components/AppComponents/App/AppHooks";
import { OakThemeProvider, oakDefaultTheme } from "@/styles/oakThemeApp";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import { FAVICON_LINKS_HEAD_INNER_HTML } from "@/image-data";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { MenuProvider } from "@/context/Menu";
import { OakNotificationsProvider } from "@/context/OakNotifications/OakNotificationsProvider";
import { SaveCountProvider } from "@/context/SaveCount/SaveCountProvider";

// https://nextjs.org/docs/app/getting-started/metadata-and-og-images
export const metadata: Metadata = {
  title: {
    template: `%s | ${getBrowserConfig("seoAppName")}`,
    default: `Free, time-saving teacher resources | ${getBrowserConfig("seoAppName")}`,
  },
  description: getBrowserConfig("seoAppDescription"),
  openGraph: getOpenGraphMetadata(),
  twitter: getTwitterMetadata(),
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "pingdom-uptime-check": getBrowserConfig("pingdomUptimeId"),
  },
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
      <StyledComponentsRegistry>
        {/* Pages Router uses #__next as the app root; add id to body for Pa11y CI and Percy to hook onto. */}
        <body id="__next" style={{ margin: "0px" }}>
          <OakThemeProvider theme={oakDefaultTheme}>
            <CookieConsentProvider>
              <PHProvider>
                <OakNotificationsProvider>
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
                      layout: {
                        logoLinkUrl: "/",
                      },
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
                      <AppHooks />
                      <MenuProvider>
                        <SaveCountProvider>
                          <SimulateErrorControls errorBoundaryLevel="global" />
                          {children}
                        </SaveCountProvider>
                      </MenuProvider>
                    </AnalyticsWrapper>
                  </ClerkProvider>
                </OakNotificationsProvider>
              </PHProvider>
            </CookieConsentProvider>
          </OakThemeProvider>
        </body>
      </StyledComponentsRegistry>
    </html>
  );
}
