"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { useMemo } from "react";

// Pathnames for pages that are gated behind login
const AUTH_REQUIRED_PATH_PREFIXES = ["/teachers/my-library"];

export function ClerkProviderWithRedirects({
  children,
  fontFamily,
}: Readonly<{ children: React.ReactNode; fontFamily: string }>) {
  const signOutUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/";
    }

    const { pathname, search } = window.location;

    if (AUTH_REQUIRED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return "/";
    }

    return `${pathname}${search}`;
  }, []);

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
