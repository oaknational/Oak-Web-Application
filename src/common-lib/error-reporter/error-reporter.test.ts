import Bugsnag from "@bugsnag/js";

import errorReporter, {
  initialiseBugsnag,
  ErrorData,
  matchesUserAgent,
} from "./error-reporter";

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
  describe("initialiseBugsnag", () => {
    it("calls Bugsnag.start", () => {
      initialiseBugsnag();
      expect(mockStart).toHaveBeenCalled();
    });
  });
  describe("[enabled]: errorReporter()()", () => {
    beforeEach(() => {
      getHasConsentedTo.mockImplementation(() => true);
    });
    it("calls bugsnag.notify with the error", async () => {
      reportError(testError);

      expect(mockNotify).toHaveBeenCalledWith(
        testError,
        expect.anything(),
        expect.anything()
      );
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
  });
  describe("[disabled]: errorReporter()()", () => {
    beforeEach(() => {
      getHasConsentedTo.mockImplementation(() => false);
    });
    it("does not call bugsnag.notify with the error", async () => {
      reportError(testError);

      expect(mockNotify).not.toHaveBeenCalled();
    });
  });
});
