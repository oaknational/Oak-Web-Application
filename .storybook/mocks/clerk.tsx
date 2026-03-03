// .storybook/mocks/clerk.tsx
import React from "react";

/**
 * Mutable auth state so stories can override it
 */
let mockAuthState = {
  isSignedIn: true,
  isLoaded: true,
  userId: "user_123",
};

export const __setMockAuthState = (state: Partial<typeof mockAuthState>) => {
  mockAuthState = { ...mockAuthState, ...state };
};

/**
 * ClerkProvider (noop wrapper)
 */
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

/**
 * useAuth mock
 */
export const useAuth = () => ({
  isLoaded: mockAuthState.isLoaded,
  isSignedIn: mockAuthState.isSignedIn,
  userId: mockAuthState.isSignedIn ? mockAuthState.userId : null,
  sessionId: mockAuthState.isSignedIn ? "sess_123" : null,
  getToken: async () => "mock-token",
});

/**
 * useUser mock
 */
export const useUser = () => ({
  isLoaded: mockAuthState.isLoaded,
  isSignedIn: mockAuthState.isSignedIn,
  user: mockAuthState.isSignedIn
    ? {
        id: mockAuthState.userId,
        firstName: "Billy",
        lastName: "Oak",
        fullName: "Billy Oak",
        primaryEmailAddress: {
          emailAddress: "billy@example.com",
        },
      }
    : null,
});

/**
 * Control components
 */
export const SignedIn = ({ children }: { children: React.ReactNode }) =>
  mockAuthState.isSignedIn ? <>{children}</> : null;

export const SignedOut = ({ children }: { children: React.ReactNode }) =>
  !mockAuthState.isSignedIn ? <>{children}</> : null;

export const SignUpButton = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

/**
 * Optional: redirect helpers (no-op)
 */
export const RedirectToSignIn = () => null;
export const RedirectToSignUp = () => null;
