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

  it("should return direct match response for 'maths' search term with appropriate keystage filters", async () => {
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
        { type: "key-stage", value: "early-years-foundation-stage" },
        { type: "key-stage", value: "ks1" },
        { type: "key-stage", value: "ks2" },
        { type: "key-stage", value: "ks3" },
        { type: "key-stage", value: "ks4" },
      ],
    });
  });
  it("should return combinations of pfs as direct match when in search term", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "ks4 french aqa" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: "french",
        keyStage: "ks4",
        examBoard: "aqa",
        year: null,
      },
      suggestedFilters: [],
    });
  });
  it("should return suggested filters for missing direct matches", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "year 10 english edexcel" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: "english",
        keyStage: null,
        examBoard: "edexcel",
        year: "year-10",
      },
      suggestedFilters: [
        { type: "key-stage", value: "ks1" },
        { type: "key-stage", value: "ks2" },
        { type: "key-stage", value: "ks3" },
        { type: "key-stage", value: "ks4" },
      ],
    });
  });
  it("should not return a direct match when the search term doesnt contain one", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [],
      },
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "macbeth" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().directMatch).toEqual(null);
  });
  it.todo("should not call AI when there is a direct subject match");
  it.todo("should call ai when there is not a direct subject match");
  it.todo("should return direct matches for ks");
  it.todo("should return direct match for examboard");
  it.todo("should return direct match for years");
  it.todo(
    "should return suggested filters based on subject curriculum data when no direct match",
  );

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
      query: { searchTerm: "golf" },
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
