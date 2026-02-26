import { PropsWithChildren } from "react";

function RenderChildren({ children }: Readonly<PropsWithChildren>) {
  return <>{children}</>;
}

const defaultUseUserReturn = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
};

function useUser() {
  return defaultUseUserReturn;
}

const clerkModule = {
  useUser,
  UserButton: () => <div data-testid="clerk-user-button" />,
  useAuth() {
    const { isLoaded, isSignedIn } = clerkModule.useUser();
    return {
      getToken: () => Promise.resolve(null),
      signOut: () => Promise.resolve(),
      isLoaded,
      isSignedIn,
      userId: undefined,
      sessionId: undefined,
      actor: undefined,
      orgId: undefined,
      orgRole: undefined,
      orgSlug: undefined,
      has: undefined,
    };
  },
  ClerkProvider: RenderChildren,
  SignUpButton: RenderChildren,
  SignedIn: ({ children }: Readonly<PropsWithChildren>) => {
    const { isLoaded, isSignedIn } = clerkModule.useUser();
    return isLoaded && isSignedIn ? <>{children}</> : null;
  },
  SignedOut: ({ children }: Readonly<PropsWithChildren>) => {
    const { isLoaded, isSignedIn } = clerkModule.useUser();
    return isLoaded && !isSignedIn ? <>{children}</> : null;
  },
  SignOutButton: RenderChildren,
  RedirectToSignUp: () => <div data-testid="clerk-redirect-to-sign-up" />,
};

module.exports = clerkModule;
