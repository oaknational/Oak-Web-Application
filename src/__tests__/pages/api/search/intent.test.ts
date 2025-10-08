import { createNextApiMocks } from "@/__tests__/__helpers__/createNextApiMocks";
import handler from "@/pages/api/search/intent";

jest.mock("@/common-lib/error-reporter/errorReporter", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock("@/context/Search/ai/withSuggestionCache", () => ({
  withSuggestionCache: jest.fn((_searchTerm, fn) => fn()),
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
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        year: null,
        examBoard: null,
      },
      suggestedFilters: [
        {
          type: "key-stage",
          slug: "early-years-foundation-stage",
          title: "EYFS",
        },
        { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
        { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
        { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
        { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
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
        subject: { title: "French", slug: "french" },
        keyStage: { title: "Key Stage 4", slug: "ks4" },
        examBoard: { title: "AQA", slug: "aqa" },
        year: null,
      },
      suggestedFilters: [],
    });
  });
  it("should not call AI when there is a direct subject match", async () => {
    const mockGenerateSuggestions = jest.fn();
    jest.mock("@/context/Search/ai/generateSuggestions", () => ({
      generateSuggestions: () => mockGenerateSuggestions(),
    }));

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "english" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockGenerateSuggestions).not.toHaveBeenCalled();
  });
  it("should return AI response when there is not a direct subject match", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [
          { slug: "maths", confidence: 4 },
          { slug: "science", confidence: 2 },
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
        { type: "subject", slug: "maths", title: "Maths" },
        { type: "subject", slug: "science", title: "Science" },
        {
          type: "key-stage",
          slug: "early-years-foundation-stage",
          title: "EYFS",
        },
        { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
        { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
        { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
        { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
      ],
    });
  });
  it("should combine direct matches and ai suggestions", async () => {
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
      query: { searchTerm: "ks3 macbeth" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: null,
        keyStage: { title: "Key Stage 3", slug: "ks3" },
        examBoard: null,
        year: null,
      },
      suggestedFilters: [
        { type: "subject", slug: "drama", title: "Drama" },
        { type: "subject", slug: "english", title: "English" },
      ],
    });
  });
  it("should get suggested pf filters from ai subject match", async () => {
    mockParse.mockResolvedValue({
      output_parsed: {
        subjects: [{ slug: "geography", confidence: 4 }],
      },
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "flooding" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [
        { type: "subject", slug: "geography", title: "Geography" },
        { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
        { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
        { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
        { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
        { type: "exam-board", slug: "aqa", title: "AQA" },
        { type: "exam-board", slug: "edexcelb", title: "Edexcel B" },
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
