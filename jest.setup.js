import { jest } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";

// Bugsnag.getPlugin("react")?.createErrorBoundary(React);
jest.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: {
    notify: jest.fn(),
    start: jest.fn(),
    startSession: jest.fn(),
    getPlugin: () => ({
      createErrorBoundary:
        () =>
        ({ children }) =>
          children,
    }),
  },
}));
// @todo move thes mocks into __mocks__ folder and import into tests that use them
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ config: {} })),
  onIdTokenChanged: jest.fn(() => () => undefined),
  onAuthStateChanged: jest.fn(() => () => undefined),
  isSignInWithEmailLink: jest.fn(() => true),
  signInWithEmailLink: jest.fn(async () => ({
    user: { email: "test@thenational.academy" },
  })),
  sendSignInLinkToEmail: jest.fn(async () => undefined),
  signOut: jest.fn(async () => undefined),
}));

export class FirebaseError extends Error {}
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  FirebaseError,
}));

// In development and production, these env variables
// are determined at build time in next.config.js
process.env.NEXT_PUBLIC_APP_VERSION = "123";
process.env.NEXT_PUBLIC_RELEASE_STAGE = "test";
process.env.NEXT_PUBLIC_BUGSNAG_API_KEY = "test bugsnag api key";
