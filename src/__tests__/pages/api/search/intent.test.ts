import { createNextApiMocks } from "@/__tests__/__helpers__/createNextApiMocks";
import handler from "@/pages/api/search/intent";

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("/api/search/intent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return direct match response for 'maths' search term", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "maths" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: "maths",
        keyStage: null,
        year: null,
        examBoard: null,
      },
      suggestedFilters: [
        { type: "subject", value: "maths" },
        { type: "key-stage", value: "ks1" },
        { type: "key-stage", value: "ks2" },
        { type: "key-stage", value: "ks3" },
        { type: "key-stage", value: "ks4" },
        { type: "exam-board", value: "aqa" },
        { type: "exam-board", value: "edexcel" },
      ],
    });
  });

  it("should return AI response for other search terms", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "science" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [
        { type: "subject", value: "maths" },
        { type: "key-stage", value: "ks4" },
        { type: "exam-board", value: "aqa" },
        { type: "subject", value: "science" },
      ],
    });
  });

  it("should return 400 for missing searchTerm", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Invalid search term",
    });
  });

  it("should return 400 for searchTerm that is too short", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "a" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Invalid search term",
    });
  });
});
