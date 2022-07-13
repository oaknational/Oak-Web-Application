import { renderHook } from "@testing-library/react-hooks";

import "../../browser-lib/oak-globals/oakGlobals";

import usePosthog from "./usePosthog";

const posthogInit = jest.fn();
const reportError = jest.fn();
const createErrorHandler = jest.fn(() => reportError);

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    ...jest.requireActual("posthog-js"),
    init: (...args: []) => posthogInit(...args),
  },
}));

describe("usePosthog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../common-lib/error-handler", () => ({
      __esModule: true,
      default: jest.fn(createErrorHandler),
    }));
  });
  test("should not call posthog.init() if enabled false", () => {
    renderHook(() => usePosthog({ enabled: false }));
    expect(posthogInit).not.toHaveBeenCalled();
  });
  test("should call posthog.init() if enabled true", () => {
    renderHook(() => usePosthog({ enabled: true }));
    expect(posthogInit).toHaveBeenCalledWith("NEXT_PUBLIC_POSTHOG_API_KEY", {
      api_host: "NEXT_PUBLIC_POSTHOG_API_HOST",
      debug: true,
    });
  });
  test("should report error if imported more than once", async () => {
    expect(reportError).not.toHaveBeenCalled();
    await import("./usePosthog");
    expect(reportError).toHaveBeenCalled();
  });
  test.todo("should return a posthog instance");
});
