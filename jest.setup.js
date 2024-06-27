import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import bugsnag from "@bugsnag/js";

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

jest.mock("./src/node-lib/curriculum-api-2023", () =>
  jest.requireActual("./src/node-lib/curriculum-api-2023/__mocks__"),
);

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
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
}));

jest.mock("@oaknational/oak-consent-client");
