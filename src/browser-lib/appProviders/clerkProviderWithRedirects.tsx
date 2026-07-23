"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Pathnames for pages that are gated behind login
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
