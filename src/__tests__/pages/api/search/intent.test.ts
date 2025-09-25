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
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        year: null,
        examBoard: null,
      },
      suggestedFilters: [
        { type: "subject", slug: "maths", title: "Maths" },
        { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
        { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
        { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
        { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
        { type: "exam-board", slug: "aqa", title: "AQA" },
        { type: "exam-board", slug: "edexcel", title: "Edexcel" },
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
        { type: "subject", slug: "maths", title: "Maths" },
        { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
        { type: "exam-board", slug: "aqa", title: "AQA" },
        { type: "subject", slug: "science", title: "Science" },
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
