import { jest } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import bugsnag from "@bugsnag/js";

vi.mock("@react-aria/ssr/dist/main", () => ({
  ...jest.requireActual("@react-aria/ssr/dist/main"),
  useSSRSafeId: () => "react-aria-generated-id",
}));

vi.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "react-use-id-test-result",
}));

vi.mock("next/dist/client/router", () => require("next-router-mock"));

vi.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: {
    notify: vi.fn(),
    start: vi.fn(),
    startSession: vi.fn(),
    getPlugin: bugsnag.getPlugin,
  },
  use(plugin) {
    const boundary = plugin.init();
    // we don't want the error boundary to swallow the errors, we want jest see them and fail the test
    delete boundary.prototype.componentDidCatch;
    return boundary;
  },
}));

vi.mock("./src/node-lib/curriculum-api", () =>
  jest.requireActual("./src/node-lib/curriculum-api/__mocks__"),
);

vi.mock("./src/node-lib/curriculum-api-2023", () =>
  jest.requireActual("./src/node-lib/curriculum-api-2023/__mocks__"),
);

vi.mock(
  "./src/browser-lib/cookie-consent/confirmic/metomic-react.hacked.ts",
  () => ({
    __esModule: true,
    MetomicProvider: ({ children }) => children,
  }),
);

vi.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: vi.fn(),
    capture: vi.fn(),
  },
}));

vi.mock("@mux/mux-player-react/lazy", () => ({
  __esModule: true,
  // noop component
  default: () => null,
}));

vi.mock("./src/image-data/generated/inline-sprite.svg", () => "svg");

vi.mock("./src/common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => () => null,
  initialiseBugsnag: vi.fn(),
}));
