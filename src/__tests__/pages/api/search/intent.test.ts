import { createNextApiMocks } from "@/__tests__/__helpers__/createNextApiMocks";
import handler from "@/pages/api/search/intent";

jest.mock("@/common-lib/error-reporter/errorReporter", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const mockParse = jest.fn();
const setMockedAiResponse = (response: unknown) => {
  mockParse.mockResolvedValue({
    choices: [
      {
        message: {
          parsed: response,
        },
      },
    ],
  });
};

jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          parse: () => mockParse(),
        },
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
      query: { v: "1", searchTerm: "maths" },
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
      query: { v: "1", searchTerm: "ks4 french aqa" },
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
    const mockCallModel = jest.fn();
    jest.mock("@/context/Search/ai/callModel", () => ({
      callModel: () => mockCallModel(),
    }));

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "english" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockCallModel).not.toHaveBeenCalled();
  });
  it("should return AI response when there is not a direct subject match", async () => {
    setMockedAiResponse({
      subjects: [
        { slug: "maths", confidence: 4 },
        { slug: "science", confidence: 2 },
      ],
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "golf" },
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
    setMockedAiResponse({
      subjects: [
        { slug: "english", confidence: 2 },
        { slug: "drama", confidence: 4 },
      ],
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "ks3 macbeth" },
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
    setMockedAiResponse({
      subjects: [{ slug: "geography", confidence: 4 }],
    });
    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "flooding" },
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
      query: { v: "1", searchTerm: "a" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Invalid search term",
    });
  });
  it("should handle empty response from OpenAI", async () => {
    setMockedAiResponse({
      subjects: [],
    });

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "unknown" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      directMatch: null,
      suggestedFilters: [],
    });
  });
  it("should throw on an error from OpenAI", async () => {
    const apiError = new Error("OpenAI API failure");
    mockParse.mockRejectedValue(apiError);

    const { req, res } = createNextApiMocks({
      method: "GET",
      query: { v: "1", searchTerm: "test" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });
});
