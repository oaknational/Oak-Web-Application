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
  it("should not call AI when there is a direct subject match", async () => {
    const mockCallModel = jest.fn();
    jest.mock("@/context/Search/ai/callModel", () => ({
      callModel: () => mockCallModel(),
    }));

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "english" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockCallModel).not.toHaveBeenCalled();
  });
  it("should not return direct match for examboards when not applicable to direct year match", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "year 3 english" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: "english",
        keyStage: null,
        year: "year-3",
        examBoard: null,
      },
      suggestedFilters: [
        { type: "key-stage", value: "ks1" },
        { type: "key-stage", value: "ks2" },
        { type: "key-stage", value: "ks3" },
        { type: "key-stage", value: "ks4" },
      ],
    });
  });
  it("should not return direct match for examboards when not applicable to direct ks match", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { searchTerm: "ks3 english" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toEqual({
      directMatch: {
        subject: "english",
        keyStage: "ks3",
        year: null,
        examBoard: null,
      },
      suggestedFilters: [],
    });
  });
  it("should return AI response when there is not a direct subject match", async () => {
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
        { type: "subject", value: "drama" },
        { type: "subject", value: "english" },
        { type: "key-stage", value: "ks1" },
        { type: "key-stage", value: "ks2" },
        { type: "key-stage", value: "ks3" },
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
        examBoard: null,
        keyStage: "ks3",
        subject: null,
        year: null,
      },
      suggestedFilters: [
        { type: "subject", value: "drama" },
        { type: "subject", value: "english" },
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
