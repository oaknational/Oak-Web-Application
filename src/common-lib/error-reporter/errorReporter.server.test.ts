/**
 * @jest-environment node
 */

import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/nextjs";

import errorReporter from "./errorReporter";

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

const testError = new Error("something bad");

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
  init: jest.fn(),
  getClient: jest.fn(() => ({})),
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
    jest.mocked(Sentry.getClient).mockReset();
    jest.mocked(Sentry.getClient).mockReturnValue(
      {} as ReturnType<typeof Sentry.getClient>,
    );
  });

  describe("[enabled]: errorReporter()()", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(consentClient, "getConsent").mockReturnValue("granted");

      (testError as { hasBeenReported?: boolean }).hasBeenReported = undefined;
    });

    describe("Sentry initialisation", () => {
      const originalDsn = process.env.SENTRY_DSN;
      const originalEnvironment = process.env.SENTRY_ENVIRONMENT;

      beforeEach(() => {
        process.env.SENTRY_DSN = "https://example@example.com/123";
        process.env.SENTRY_ENVIRONMENT = "preview";
      });

      afterEach(() => {
        if (originalDsn === undefined) {
          delete process.env.SENTRY_DSN;
        } else {
          process.env.SENTRY_DSN = originalDsn;
        }

        if (originalEnvironment === undefined) {
          delete process.env.SENTRY_ENVIRONMENT;
        } else {
          process.env.SENTRY_ENVIRONMENT = originalEnvironment;
        }
      });

      it("initialises Sentry on the server when no client exists", async () => {
        jest
          .mocked(Sentry.getClient)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({} as ReturnType<typeof Sentry.getClient>);

        await reportError(new Error("Initialisation test"));

        expect(Sentry.init).toHaveBeenCalledWith({
          dsn: process.env.SENTRY_DSN,
          environment: "preview",
          sendDefaultPii: false,
        });
      });

      it("does not initialise Sentry when a client already exists", async () => {
        await reportError(new Error("Existing client test"));

        expect(Sentry.init).not.toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalled();
      });

      it("does not initialise Sentry without a DSN", async () => {
        delete process.env.SENTRY_DSN;

        jest.mocked(Sentry.getClient).mockReturnValue(undefined);

        await reportError(new Error("Missing DSN test"));

        expect(Sentry.init).not.toHaveBeenCalled();
        expect(Sentry.captureException).not.toHaveBeenCalled();
      });
    });
  });
});
