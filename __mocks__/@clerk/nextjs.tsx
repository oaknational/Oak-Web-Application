import { PropsWithChildren } from "react";
import { vi } from "vitest";

function RenderChildren({ children }: PropsWithChildren) {
  return <>{children}</>;
}

module.exports = {
  useUser: vi.fn().mockReturnValue({
    isLoaded: true,
    isSignedIn: false,
    user: null,
  }),
  UserButton: () => <div data-testid="clerk-user-button" />,
  useAuth() {
    return {
      getToken: () => Promise.resolve(null),
      signOut: () => Promise.resolve(),
      isLoaded: true,
      isSignedIn: false,
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
  SignedIn: RenderChildren,
  SignedOut: RenderChildren,
  SignOutButton: RenderChildren,
  RedirectToSignUp: () => <div data-testid="clerk-redirect-to-sign-up" />,
};
