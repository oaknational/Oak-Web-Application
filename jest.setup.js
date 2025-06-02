import { TextEncoder, TextDecoder } from "node:util";

import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import bugsnag from "@bugsnag/js";
import { installMockIntersectionObserver } from "@oaknational/oak-components";

// Override this with `TEST_ALLOW_LOGGING=1` if you want logs locally
if (process.env.TEST_ALLOW_LOGGING !== "1") {
  ["log", "info", "error", "warn", "debug"].forEach((type) => {
    console[type] = (message) => {
      throw new Error(
        `Failed: We don't allow console.${type} while running tests!\n\n${message}`,
      );
    };
  });
}

// TextEncoder and TextDecoder are Web APIs but not available in JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// JSDOM does not implement SubmitEvent
global.SubmitEvent =
  global.SubmitEvent ||
  class MockSubmitEvent extends Event {
    constructor(name, options) {
      super(name, options);
      this.submitter = options?.submitter ?? null;
    }
  };
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "react-use-id-test-result",
}));

jest.mock("next/dist/client/router", () => require("next-router-mock"));

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

jest.mock("@sentry/nextjs", () => ({
  __esModule: true,
  getClient: jest.fn(),
  init: jest.fn(),
  captureException: jest.fn(),
  withScope: jest.fn((cb) => cb()),
}));

/**
 * Mock the ErrorBoundary component globally to avoid it swallowing errors in tests.
 * This is necessary as the ErrorBoundary component is a global component that wraps
 * the entire app. If an error is thrown in a test, we want Jest to see it and fail the test.
 */
jest.mock("./src/components/AppComponents/ErrorBoundary/ErrorBoundary", () => {
  return {
    __esModule: true,
    default: ({ children }) => children,
  };
});

jest.mock("./src/node-lib/curriculum-api-2023", () =>
  jest.requireActual("./src/node-lib/curriculum-api-2023/__mocks__"),
);

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
    onFeatureFlags: jest.fn(),
    isFeatureEnabled: jest.fn(),
  },
}));

jest.mock("@mux/mux-player-react/lazy", () => ({
  __esModule: true,
  // noop component
  default: () => null,
}));

jest.mock("./src/image-data/generated/inline-sprite.svg", () => "svg");

jest.mock("./src/common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
}));

jest.mock("@oaknational/oak-consent-client");
jest.mock("@clerk/nextjs");

jest.mock("nanoid", () => {
  return {
    nanoid: (len) => Array(len).fill("x").join(""),
  };
});

installMockIntersectionObserver();

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: jest.fn(() => ({
    data: 0,
    isLoading: false,
  })),
}));
