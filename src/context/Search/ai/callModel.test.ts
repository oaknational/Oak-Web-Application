import { callModel } from "./callModel";

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
describe("callModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a sorted subjects array", async () => {
    setMockedAiResponse({
      subjects: [
        { slug: "history", confidence: 3 },
        { slug: "maths", confidence: 5 },
        { slug: "science", confidence: 4 },
      ],
    });

    const result = await callModel("education");

    expect(result).toEqual([
      { slug: "maths", confidence: 5 },
      { slug: "science", confidence: 4 },
      { slug: "history", confidence: 3 },
    ]);
  });

  it("should throw when response is invalid", async () => {
    setMockedAiResponse(null);

    await expect(callModel("test")).rejects.toThrow();
  });

  it("should return empty array when no subjects in response", async () => {
    setMockedAiResponse({
      subjects: [],
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
