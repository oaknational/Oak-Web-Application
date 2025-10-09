import { callModel } from "./callModel";
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
describe("callModel", () => {
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
