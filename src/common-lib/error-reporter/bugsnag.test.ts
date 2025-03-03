import Bugsnag, { Event as BugsnagEvent } from "@bugsnag/js";

import { matchesUserAgent, matchesIgnoredErrorBugsnag } from "./errorFiltering";
import { initialiseBugsnag, getBugsnagOnError } from "./bugsnag";

jest.mock("./errorFiltering", () => ({
  __esModule: true,
  matchesUserAgent: jest.fn(),
  matchesIgnoredErrorSentry: jest.fn(),
  matchesIgnoredErrorBugsnag: jest.fn(),
}));

const consoleLog = jest.fn();
const consoleError = jest.fn();
const consoleWarn = jest.fn();
const logger = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError,
};

const mockStart = jest.fn();
Bugsnag.start = mockStart;

describe("common-lib/error-reporter", () => {
  describe("Bugsnag onError handler", () => {
    it("should check for ignored user agents", () => {
      const event = {
        device: { userAgent: "real browser" },
        errors: [
          {
            errorMessage: "real error",
            stacktrace: [{ file: "real file" }],
          },
        ],
      } as BugsnagEvent;
      getBugsnagOnError({ logger })(event);

      expect(matchesUserAgent).toHaveBeenCalledWith("real browser");
    });

    it("should check for ignored errors", () => {
      const event = {
        device: {},
        errors: [
          {
            errorMessage: "Test error",
            stacktrace: [],
          },
        ],
      } as unknown as BugsnagEvent;
      getBugsnagOnError({ logger })(event);

      expect(matchesIgnoredErrorBugsnag).toHaveBeenCalledWith({
        errorMessage: "Test error",
        stacktrace: [],
      });
    });
  });

  describe("initialiseBugsnag", () => {
    it("calls Bugsnag.start", () => {
      const userId = "1234";
      initialiseBugsnag(userId);
      expect(mockStart).toHaveBeenCalled();
    });
  });
});
