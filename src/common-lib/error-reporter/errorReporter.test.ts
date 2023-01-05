import Bugsnag, { Event as BugsnagEvent } from "@bugsnag/js";

import OakError from "../../errors/OakError";

import errorReporter, {
  initialiseBugsnag,
  ErrorData,
  matchesUserAgent,
  matchesIgnoredError,
  bugsnagOnError,
} from "./errorReporter";

const getHasConsentedTo = jest.fn();

jest.mock("../../browser-lib/cookie-consent/getHasConsentedTo", () => ({
  __esModule: true,
  default: (service: string) => getHasConsentedTo(service),
}));

const parentMetaFields = {
  query: { paramName: "paramValue" },
};
const testContext = "/test/endpoint";
const reportError = errorReporter(testContext, parentMetaFields);

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
Bugsnag.notify = mockNotify;
jest.mock("./bugsnagNotify", () => ({
  __esModule: true,
  default: (err: unknown, cb: unknown) => mockNotify(err, cb),
}));

const mockStart = jest.fn();
Bugsnag.start = mockStart;

const consoleLog = jest.fn();
const consoleError = jest.fn();
jest.mock("./logging", () => ({
  consoleLog: (...args: []) => consoleLog(...args),
  consoleError: (...args: []) => consoleError(...args),
}));

describe("common-lib/error-reporter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("matchesUserAgent", () => {
    it("returns false if the ua string doesn't contain words in the disallow list", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4619.141 Safari/537.36"
        )
      ).toBe(false);
    });
    it("returns true if ua string contains 'percy'", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) percy AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4619.141 Safari/537.36"
        )
      ).toBe(true);
    });
  });
  describe("matchesIgnoredError", () => {
    it("returns false if the error should not be ignored", () => {
      const shouldIgnore = matchesIgnoredError(
        "Proper error that should be reported"
      );
      expect(shouldIgnore).toBe(false);
    });
    it("returns true if the error should be ignored", () => {
      const shouldIgnore = matchesIgnoredError("Test error");
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
          },
        ],
      } as BugsnagEvent;
      const result = bugsnagOnError(event);
      expect(result).toBe(undefined);
    });
    it("Returns false for ignored user agents", () => {
      const event = {
        device: { userAgent: "detectify" },
      } as BugsnagEvent;
      const result = bugsnagOnError(event);
      expect(result).toBe(false);
    });
    it("Returns false for ignored errors", () => {
      const event = {
        device: {},
        errors: [
          {
            errorMessage: "Test error",
          },
        ],
      } as BugsnagEvent;
      const result = bugsnagOnError(event);
      expect(result).toBe(false);
    });
  });
  describe("initialiseBugsnag", () => {
    it("calls Bugsnag.start", () => {
      const userId = "1234";
      initialiseBugsnag(userId);
      expect(mockStart).toHaveBeenCalled();
    });
  });
  describe("[enabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getHasConsentedTo.mockImplementation(() => true);
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
        "Failed to send error to bugsnag:"
      );
      expect(consoleError).toHaveBeenCalledWith("bad thing");
      expect(consoleLog).toHaveBeenCalledWith("Original error:");
      expect(consoleError).toHaveBeenCalledWith("test thing");
    });
    test("adds originalError if error is OakError", () => {
      const originalError = new Error(
        "some error from somewhere (not our fault!)"
      );
      const oakError = new OakError({ code: "misc/unknown", originalError });
      reportError(oakError);

      expect(event.addMetadata).toHaveBeenCalledWith("Meta", {
        ...parentMetaFields,
        originalError,
      });
    });
  });
  describe("[disabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getHasConsentedTo.mockImplementation(() => false);
    });
    it("does not call bugsnag.notify with the error", async () => {
      reportError(testError);

      expect(mockNotify).not.toHaveBeenCalled();
    });
  });
});
