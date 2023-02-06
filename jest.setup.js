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

jest.mock("./src/node-lib/curriculum-api", () =>
  jest.requireActual("./src/node-lib/curriculum-api/__mocks__")
);

jest.mock(
  "./src/browser-lib/cookie-consent/confirmic/metomic-react.hacked.ts",
  () => ({
    __esModule: true,
    MetomicProvider: ({ children }) => children,
  })
);

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
  },
}));
