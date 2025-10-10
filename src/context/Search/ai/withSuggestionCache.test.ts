import { withSuggestionCache } from "./withSuggestionCache";
import type { Suggestions } from "./generateSuggestions";

const mockGet = jest.fn();
const mockSet = jest.fn();

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@upstash/redis", () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: (...args: unknown[]) => mockGet(...args),
    set: (...args: unknown[]) => mockSet(...args),
  })),
}));

jest.mock("@/node-lib/getServerConfig", () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    if (key === "upstashRedisUrl") return "http://mock-redis";
    if (key === "upstashRedisToken") return "mock-token";
    return null;
  }),
}));

describe("withSuggestionCache", () => {
  const mockSuggestions: Suggestions = [
    { slug: "maths", confidence: 5 },
    { slug: "science", confidence: 3 },
  ];

  const mockGenerateFn = jest.fn().mockResolvedValue(mockSuggestions);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue("OK");
  });

  it("should call generate function on cache miss and store result", async () => {
    const result = await withSuggestionCache("test", mockGenerateFn);

    expect(mockGet).toHaveBeenCalledWith("search:intent:v1:test");
    expect(mockGenerateFn).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      "search:intent:v1:test",
      JSON.stringify(mockSuggestions),
      { ex: 90 * 24 * 60 * 60 },
    );
    expect(result).toEqual(mockSuggestions);
  });

  it("should return cached value on cache hit without calling generate function", async () => {
    mockGet.mockResolvedValue(mockSuggestions);

    const result = await withSuggestionCache("test", mockGenerateFn);

    expect(mockGet).toHaveBeenCalledWith("search:intent:v1:test");
    expect(mockGenerateFn).not.toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled();
    expect(result).toEqual(mockSuggestions);
  });

  it("should normalize search term to lowercase", async () => {
    await withSuggestionCache("Shakespeare", mockGenerateFn);

    expect(mockGet).toHaveBeenCalledWith("search:intent:v1:shakespeare");
    expect(mockSet).toHaveBeenCalledWith(
      "search:intent:v1:shakespeare",
      expect.any(String),
      expect.any(Object),
    );
  });

  it("should remove whitespace from search term", async () => {
    await withSuggestionCache("shake speare", mockGenerateFn);

    expect(mockGet).toHaveBeenCalledWith("search:intent:v1:shakespeare");
    expect(mockSet).toHaveBeenCalledWith(
      "search:intent:v1:shakespeare",
      expect.any(String),
      expect.any(Object),
    );
  });

  it("should handle invalid cache data by calling generate function", async () => {
    mockGet.mockResolvedValue({ invalid: "data" });

    const result = await withSuggestionCache("test", mockGenerateFn);

    expect(mockGenerateFn).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalled();
    expect(result).toEqual(mockSuggestions);
  });
});
