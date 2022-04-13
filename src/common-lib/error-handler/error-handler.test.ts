import Bugsnag from "@bugsnag/js";

import { createErrorHandler, ErrorData } from "./error-handler";

const parentMetaFields = {
  query: { paramName: "paramValue" },
};
const testContext = "/test/endpoint";
const errorHandler = createErrorHandler(testContext, parentMetaFields);

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
const mockNotify = jest.fn(async (err, cb) => {
  cb(event);
});

Bugsnag.notify = mockNotify;

describe("error-handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("it calls bugsnag.notify with the error", async () => {
    errorHandler(testError);

    expect(mockNotify).toHaveBeenCalledWith(
      testError,
      expect.anything(),
      expect.anything()
    );
  });
  test("it adds relevent fields to bugsnag event", async () => {
    errorHandler(testError, testData);

    expect(event.context).toBe(testContext);
    expect(event.severity).toBe("error");
    expect(event.groupingHash).toBe(testData.groupingHash);
  });

  test("it adds Meta fields", async () => {
    errorHandler(testError, testData);

    expect(event.addMetadata).toHaveBeenCalledWith("Meta", {
      ...parentMetaFields,
      ...childMetaFields,
    });
  });
});
