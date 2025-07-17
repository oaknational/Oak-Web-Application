import * as Sentry from "@sentry/nextjs";

import { initialiseSentry, getSentryBeforeSend } from "./sentry";

import {
  matchesUserAgent,
  matchesIgnoredErrorSentry,
} from "@/common-lib/error-reporter/errorFiltering";

jest.mock("@sentry/nextjs", () => ({
  init: jest.fn(),
}));

jest.mock("@/common-lib/error-reporter/errorFiltering", () => ({
  matchesUserAgent: jest.fn(),
  matchesIgnoredErrorSentry: jest.fn(),
}));

jest.mock("@/browser-lib/getBrowserConfig", () => jest.fn());

const consoleLog = jest.fn();
const consoleError = jest.fn();
const consoleWarn = jest.fn();

const logger = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError,
};

describe("common-lib/error-reporter/sentry", () => {
  describe("getSentryBeforeSend", () => {
    it("should check for ignored user agents", () => {
      getSentryBeforeSend({ logger })({
        request: {
          headers: {
            "User-Agent": "test-agent",
          },
        },
        type: undefined,
      });

      expect(matchesUserAgent).toHaveBeenCalledWith("test-agent");
    });

    it("should check for ignored issues", () => {
      getSentryBeforeSend({ logger })({
        exception: {
          values: [
            {
              value: "known error",
            },
          ],
        },
        type: undefined,
      });

      expect(matchesIgnoredErrorSentry).toHaveBeenCalledWith({
        value: "known error",
      });
    });
  });

  describe("initialiseSentry", () => {
    it("should initialise Sentry with a userId when provided", () => {
      const userId = "test-user";
      initialiseSentry(userId);

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          initialScope: {
            user: { id: userId },
          },
        }),
      );
    });

    it("should initialise Sentry with undefined user when userId is null", () => {
      initialiseSentry(null);

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          initialScope: {
            user: undefined,
          },
        }),
      );
    });
  });
});
