import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/nextjs";

import OakError from "../../errors/OakError";

import errorReporter, { ErrorData } from "./errorReporter";

import { consentClient } from "@/browser-lib/cookie-consent/consentClient";

jest.mock("../../browser-lib/cookie-consent/consentClient");
jest.mock("./errorFiltering", () => ({
  __esModule: true,
  matchesUserAgent: jest.fn(),
  matchesIgnoredErrorSentry: jest.fn(),
  matchesIgnoredErrorBugsnag: jest.fn(),
}));

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

// Mocks for Sentry
const mockSetTag = jest.fn();
const mockSetLevel = jest.fn();
const mockSetFingerprint = jest.fn();
const mockSetExtra = jest.fn();

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
  withScope: jest.fn((callback) =>
    callback({
      setTag: mockSetTag,
      setLevel: mockSetLevel,
      setFingerprint: mockSetFingerprint,
      setExtra: mockSetExtra,
    }),
  ),
}));

describe("common-lib/error-reporter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("[enabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(consentClient, "getConsent").mockReturnValue("granted");

      (testError as { hasBeenReported?: boolean }).hasBeenReported = undefined;
    });

    it("should report the error to both Sentry and Bugsnag", async () => {
      await reportError(testError);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(Sentry.captureException).toHaveBeenCalledWith(testError);
      } else {
        expect(mockNotify).toHaveBeenCalledWith(testError, expect.anything());
      }
    });

    it("adds relevant fields to bugsnag and Sentry events", async () => {
      await reportError(testError, testData);
      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(mockSetTag).toHaveBeenCalledWith("context", testContext);
        expect(mockSetLevel).toHaveBeenCalledWith("error");
        expect(mockSetFingerprint).toHaveBeenCalledWith([
          testData.groupingHash,
        ]);
      } else {
        expect(event.context).toBe(testContext);
        expect(event.severity).toBe("error");
        expect(event.groupingHash).toBe(testData.groupingHash);
      }
    });

    it("adds Meta fields", async () => {
      const aggregatedMeta = { ...parentMetaFields, ...childMetaFields };
      await reportError(testError, testData);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        Object.entries(aggregatedMeta).forEach(([key, value]) => {
          expect(mockSetExtra).toHaveBeenCalledWith(key, value);
        });
      } else {
        expect(event.addMetadata).toHaveBeenCalledWith("Meta", aggregatedMeta);
      }
    });

    if (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== "true") {
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
    }

    test("adds originalError if error is OakError", async () => {
      const originalError = new Error(
        "some error from somewhere (not our fault!)",
      );
      const oakError = new OakError({ code: "misc/unknown", originalError });
      await reportError(oakError);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(mockSetExtra).toHaveBeenCalledWith(
          "originalError",
          originalError,
        );
      } else {
        expect(event.addMetadata).toHaveBeenCalledWith("Meta", {
          ...parentMetaFields,
          originalError,
        });
      }
    });

    test("should not report the error if error.hasBeenReported is true", async () => {
      const error = new OakError({ code: "misc/unknown" });
      error.hasBeenReported = true;

      await reportError(error);
      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(Sentry.captureException).not.toHaveBeenCalled();
      } else {
        expect(mockNotify).not.toHaveBeenCalled();
      }
    });

    test("should not report the error if error.config.shouldNotify is false", async () => {
      const error = new OakError({ code: "preview/zod-error" });
      error.config.shouldNotify = false;

      await reportError(error);

      expect(mockNotify).not.toHaveBeenCalled();
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    test("should not report the error if some nested originalError.hasBeenReported is true", async () => {
      await reportError({
        originalError: {
          originalError: {
            originalError: {
              hasBeenReported: true,
            },
          },
        },
      });

      expect(mockNotify).not.toHaveBeenCalled();
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    test("will not get stuck in a recursive loop", async () => {
      const error = new Error("self referential error");
      (error as { originalError?: unknown }).originalError = error;

      await reportError(error);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(Sentry.captureException).toHaveBeenCalled();
      } else {
        expect(mockNotify).toHaveBeenCalled();
      }
    });

    test("sets error.hasBeenReported = true", async () => {
      const error = new OakError({ code: "misc/unknown" });

      await reportError(error);

      expect(error.hasBeenReported).toBe(true);
    });

    test("will not report same error twice", async () => {
      const error = new OakError({ code: "misc/unknown" });

      await reportError(error);
      await reportError(error);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
      } else {
        expect(mockNotify).toHaveBeenCalledTimes(1);
      }

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

    it("should not report the error", async () => {
      await reportError(testError);

      if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
        expect(Sentry.captureException).not.toHaveBeenCalled();
      } else {
        expect(mockNotify).not.toHaveBeenCalled();
      }
    });
  });
});
