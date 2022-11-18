import { jest } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import bugsnag from "@bugsnag/js";

jest.mock("@react-aria/ssr/dist/main", () => ({
  ...jest.requireActual("@react-aria/ssr/dist/main"),
  useSSRSafeId: () => "react-aria-generated-id",
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "react-use-id-test-result",
}));

jest.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: {
    notify: jest.fn(),
    start: jest.fn(),
    startSession: jest.fn(),
    getPlugin: bugsnag.getPlugin,
  },
  use(plugin) {
    const boundary = plugin.init();
    // we don't want the error boundary to swallow the errors, we want jest see them and fail the test
    delete boundary.prototype.componentDidCatch;
    return boundary;
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

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
  },
}));
