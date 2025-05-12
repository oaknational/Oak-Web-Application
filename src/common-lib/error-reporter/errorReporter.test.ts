import Bugsnag, { Event as BugsnagEvent } from "@bugsnag/js";

import OakError from "../../errors/OakError";

import errorReporter, {
  initialiseBugsnag,
  ErrorData,
  matchesUserAgent,
  matchesIgnoredError,
  getBugsnagOnError,
} from "./errorReporter";

import { consentClient } from "@/browser-lib/cookie-consent/consentClient";

jest.mock("../../browser-lib/cookie-consent/consentClient");

const parentMetaFields = {
  query: { paramName: "paramValue" },
};
const testContext = "/test/endpoint";
const consoleLog = jest.fn();
const consoleError = jest.fn();
const consoleWarn = jest.fn();
const logger = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError,
};
const reportError = errorReporter(testContext, parentMetaFields, { logger });

const childMetaFields = {
  resourceId: "resource-123",
};
const testError = new Error("something bad");
const testData: ErrorData = {
  severity: "error",
  groupingHash: "unique-group-123",
  ...childMetaFields,
};

const event = {
  context: undefined,
  severity: undefined,
  groupingHash: undefined,
  addMetadata: jest.fn(),
};

const mockNotify = jest.fn(async (err, cb) => cb(event));
jest.mock("./bugsnagNotify", () => ({
  __esModule: true,
  default: (err: unknown, cb: unknown) => mockNotify(err, cb),
}));

const mockStart = jest.fn();
Bugsnag.start = mockStart;

describe("common-lib/error-reporter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("matchesUserAgent", () => {
    it("returns false if the ua string doesn't contain words in the disallow list", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4619.141 Safari/537.36",
        ),
      ).toBe(false);
    });
    it("returns true if ua string contains 'percy'", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) percy AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4619.141 Safari/537.36",
        ),
      ).toBe(true);
    });
  });
  describe("matchesIgnoredError", () => {
    it("returns false if the error should not be ignored", () => {
      const shouldIgnore = matchesIgnoredError({
        errorMessage: "Proper error that should be reported",
        stacktrace: [],
      });
      expect(shouldIgnore).toBe(false);
    });
    it("returns true if the error should be ignored based on message", () => {
      const shouldIgnore = matchesIgnoredError({
        errorMessage: "Test error",
        stacktrace: [],
      });
      expect(shouldIgnore).toBe(true);
    });
    it("returns true if the error should be ignored based on stacktrace", () => {
      const shouldIgnore = matchesIgnoredError({
        errorMessage: "Proper error message",
        stacktrace: [{ file: "https://OAK_TEST_ERROR_STACKTRACE_FILE.js" }],
      });
      expect(shouldIgnore).toBe(true);
    });
    it("returns true if the error should be ignored based on subdomains", () => {
      const shouldIgnore = matchesIgnoredError({
        errorMessage: "Proper error message",
        stacktrace: [{ file: "https://something.hubspot.com/foo.js" }],
      });
      expect(shouldIgnore).toBe(true);
    });
  });
  describe("Bugsnag onError handler", () => {
    it("Returns undefined for non-ignored error", () => {
      const event = {
        device: { userAgent: "real browser" },
        errors: [
          {
            errorMessage: "real error",
            stacktrace: [{ file: "real file" }],
          },
        ],
      } as BugsnagEvent;
      const result = getBugsnagOnError({ logger })(event);
      expect(result).toBe(undefined);
    });
    it("Returns false for ignored user agents", () => {
      const event = {
        device: { userAgent: "detectify" },
      } as BugsnagEvent;
      const result = getBugsnagOnError({ logger })(event);
      expect(result).toBe(false);
    });
    it("Returns false for ignored errors", () => {
      const event = {
        device: {},
        errors: [
          {
            errorMessage: "Test error",
            stacktrace: [],
          },
        ],
      } as unknown as BugsnagEvent;
      const result = getBugsnagOnError({ logger })(event);
      expect(result).toBe(false);
    });
  });
  describe("initialiseBugsnag", () => {
    it("calls Bugsnag.start", () => {
      initialiseBugsnag();
      expect(mockStart).toHaveBeenCalled();
    });
  });
  describe("[enabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(consentClient, "getConsent").mockReturnValue("granted");

      (testError as { hasBeenReported?: boolean }).hasBeenReported = undefined;
    });
    it("calls bugsnag.notify with the error", async () => {
      reportError(testError);

      expect(mockNotify).toHaveBeenCalledWith(testError, expect.anything());
    });
    it("adds relevent fields to bugsnag event", async () => {
      reportError(testError, testData);

      expect(event.context).toBe(testContext);
      expect(event.severity).toBe("error");
      expect(event.groupingHash).toBe(testData.groupingHash);
    });

    it("adds Meta fields", async () => {
      reportError(testError, testData);

      expect(event.addMetadata).toHaveBeenCalledWith("Meta", {
        ...parentMetaFields,
        ...childMetaFields,
      });
    });

    it("logs if bugsnag.notify throws", async () => {
      mockNotify.mockImplementationOnce(() => Promise.reject("bad thing"));

      await reportError("test thing");
      expect(consoleLog).toHaveBeenCalledWith(
        "Failed to send error to bugsnag:",
      );
      expect(consoleError).toHaveBeenCalledWith("bad thing");
      expect(consoleLog).toHaveBeenCalledWith("Original error:");
      expect(consoleError).toHaveBeenCalledWith("test thing");
    });
    test("adds originalError if error is OakError", () => {
      const originalError = new Error(
        "some error from somewhere (not our fault!)",
      );
      const oakError = new OakError({ code: "misc/unknown", originalError });
      reportError(oakError);

      expect(event.addMetadata).toHaveBeenCalledWith("Meta", {
        ...parentMetaFields,
        originalError,
      });
    });
    test("will not call Bugsnag.notify if error.hasBeenReported is true", () => {
      const error = new OakError({ code: "misc/unknown" });
      error.hasBeenReported = true;
      reportError(error);
      expect(mockNotify).not.toHaveBeenCalled();
    });

    test("will not call Bugsnag.notify if error.config.shouldNotify is false", () => {
      const error = new OakError({ code: "preview/zod-error" });
      error.config.shouldNotify = false;
      reportError(error);
      expect(mockNotify).not.toHaveBeenCalled();
    });

    test("will not call Bugsnag.notify if some nested originalError.hasBeenReported is true", () => {
      reportError({
        originalError: {
          originalError: {
            originalError: {
              hasBeenReported: true,
            },
          },
        },
      });
      expect(mockNotify).not.toHaveBeenCalled();
    });
    test("will not get stuck in a recursive loop", () => {
      const error = new Error("self referential error");
      (error as { originalError?: unknown }).originalError = error;
      reportError(error);
      expect(mockNotify).toHaveBeenCalled();
    });
    test("sets error.hasBeenReported = true", async () => {
      const error = new OakError({ code: "misc/unknown" });
      reportError(error);
      expect(error.hasBeenReported).toBe(true);
    });
    test("will not report same error twice", () => {
      const error = new OakError({ code: "misc/unknown" });
      reportError(error);
      reportError(error);
      expect(mockNotify).toHaveBeenCalledTimes(1);
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining("already reported"),
      );
    });
  });
  describe("[disabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(consentClient, "getConsent").mockReturnValue("denied");
    });
    it("does not call bugsnag.notify with the error", async () => {
      reportError(testError);

      expect(mockNotify).not.toHaveBeenCalled();
    });
  });
});
