import {
  matchesIgnoredErrorBugsnag,
  matchesIgnoredErrorSentry,
  matchesUserAgent,
} from "@/common-lib/error-reporter/errorFiltering";

describe("common-lib/error-reporter/errorFiltering", () => {
  describe("matchesUserAgent", () => {
    it("returns false for standard browser user agent", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4619.141 Safari/537.36",
        ),
      ).toBe(false);
    });

    it("returns true for Detectify user agent", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) Detectify AppleWebKit/537.36",
        ),
      ).toBe(true);
    });

    it("returns true for Percy user agent", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) percy AppleWebKit/537.36",
        ),
      ).toBe(true);
    });

    it("is case insensitive for user agent matching", () => {
      expect(
        matchesUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) PERCY AppleWebKit/537.36",
        ),
      ).toBe(true);
    });
  });

  describe("matchesIgnoredErrorBugsnag", () => {
    it("returns false if the error should not be ignored", () => {
      const shouldIgnore = matchesIgnoredErrorBugsnag({
        errorMessage: "Proper error that should be reported",
        stacktrace: [],
      });

      expect(shouldIgnore).toBe(false);
    });

    it("returns true if the error should be ignored based on message", () => {
      const shouldIgnore = matchesIgnoredErrorBugsnag({
        errorMessage: "Test error",
        stacktrace: [],
      });

      expect(shouldIgnore).toBe(true);
    });

    it("returns true if the error should be ignored based on stacktrace", () => {
      const shouldIgnore = matchesIgnoredErrorBugsnag({
        errorMessage: "Proper error message",
        stacktrace: [{ file: "https://OAK_TEST_ERROR_STACKTRACE_FILE.js" }],
      });

      expect(shouldIgnore).toBe(true);
    });

    it("returns true if the error should be ignored based on subdomains", () => {
      const shouldIgnore = matchesIgnoredErrorBugsnag({
        errorMessage: "Proper error message",
        stacktrace: [{ file: "https://something.hubspot.com/foo.js" }],
      });

      expect(shouldIgnore).toBe(true);
    });
  });

  describe("matchesIgnoredErrorSentry", () => {
    it("returns false if the error should not be ignored", () => {
      const shouldIgnore = matchesIgnoredErrorSentry({
        value: "Proper error that should be reported",
        stacktrace: { frames: [] },
      });

      expect(shouldIgnore).toBe(false);
    });

    it("returns true if the error should be ignored based on message", () => {
      const shouldIgnore = matchesIgnoredErrorSentry({
        value: "Test error",
        stacktrace: { frames: [] },
      });

      expect(shouldIgnore).toBe(true);
    });

    it("returns true if the error should be ignored based on stacktrace", () => {
      const shouldIgnore = matchesIgnoredErrorSentry({
        value: "Proper error message",
        stacktrace: {
          frames: [{ filename: "https://OAK_TEST_ERROR_STACKTRACE_FILE.js" }],
        },
      });

      expect(shouldIgnore).toBe(true);
    });

    it("returns true if the error should be ignored based on subdomains", () => {
      const shouldIgnore = matchesIgnoredErrorSentry({
        value: "Proper error message",
        stacktrace: {
          frames: [{ filename: "https://something.hubspot.com/foo.js" }],
        },
      });

      expect(shouldIgnore).toBe(true);
    });
  });
});
