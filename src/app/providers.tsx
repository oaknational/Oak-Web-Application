"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { useMemo } from "react";

import { getPosthogInitConfig } from "@/browser-lib/posthog/getPosthogInitConfig";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (typeof window !== "undefined") {
  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";
  // Reverse proxy posthog in development to avoid localhost CORS issues in Chrome https://posthog.com/docs/advanced/proxy/nextjs
  posthog.init(
    getBrowserConfig("posthogApiKey"),
    getPosthogInitConfig({
      apiHost: isDevelopmentBuild
        ? "/ingest"
        : getBrowserConfig("posthogApiHost"),
      uiHost: isDevelopmentBuild
        ? getBrowserConfig("posthogApiHost")
        : undefined,
    }),
  );
}
export function PHProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

const authRequiredPathnameRegex = /teachers\/my-library/;

export function ClerkProviderWithRedirects({
  children,
  fontFamily,
}: Readonly<{ children: React.ReactNode; fontFamily: string }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const signOutUrl = useMemo(() => {
    if (pathname) {
      const isAuthRequiredPath = pathname.match(authRequiredPathnameRegex);
      if (isAuthRequiredPath) {
        return "/";
      }
      let currentPath = pathname;
      if (searchParams) {
        currentPath += `?${searchParams.toString()}`;
      }
      return currentPath;
    }
  }, [pathname, searchParams]);

  return (
    <ClerkProvider
      signInUrl={"/sign-in"}
      signUpUrl={"/sign-in"}
      afterSignOutUrl={signOutUrl}
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
          fontFamily,
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
  );
}
