import { PropsWithChildren } from "react";

function RenderChildren({ children }: PropsWithChildren) {
  return <>{children}</>;
}

module.exports = {
  ...jest.createMockFromModule("@clerk/nextjs"),
  useUser() {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: undefined,
    };
  },
  ClerkProvider: RenderChildren,
  SignedIn: RenderChildren,
  SignedOut: RenderChildren,
  SignOutButton: RenderChildren,
};
