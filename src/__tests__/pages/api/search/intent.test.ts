import { createNextApiMocks } from "@/__tests__/__helpers__/createNextApiMocks";
import handler, { callModel } from "@/pages/api/search/intent";

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const mockParse = jest.fn();
jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      responses: {
        parse: () => mockParse(),
      },
    })),
  };
});

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
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [
          { slug: "english", confidence: 2 },
          { slug: "drama", confidence: 4 },
        ],
      },
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "science" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [
        { type: "subject", slug: "drama" },
        { type: "subject", slug: "english" },
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

  it("should handle empty response from OpenAI", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [],
      },
    });

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "unknown" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [],
    });
  });

  it("should handle null output_parsed from OpenAI", async () => {
    mockParse.mockResolvedValue({
      output_parsed: null,
    });

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "test" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [],
    });
  });
});

describe("callModel function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a sorted subjects array", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [
          { slug: "history", confidence: 3 },
          { slug: "maths", confidence: 5 },
          { slug: "science", confidence: 4 },
        ],
      },
    });

    const result = await callModel("education");

    expect(result).toEqual([
      { slug: "maths", confidence: 5 },
      { slug: "science", confidence: 4 },
      { slug: "history", confidence: 3 },
    ]);
  });

  it("should return empty array when output_parsed is null", async () => {
    mockParse.mockResolvedValue({
      output_parsed: null,
    });

    const result = await callModel("test");

    expect(result).toEqual([]);
  });

  it("should return empty array when no subjects in response", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [],
      },
    });

    const result = await callModel("unknown");

    expect(result).toEqual([]);
  });

  it("should throw error when OpenAI API fails", async () => {
    const apiError = new Error("OpenAI API failure");
    mockParse.mockRejectedValue(apiError);

    await expect(callModel("test")).rejects.toThrow("OpenAI API failure");
  });
});
