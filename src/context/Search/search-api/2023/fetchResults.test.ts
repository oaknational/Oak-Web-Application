import elasticResponse2023 from "./elasticResponse.2023.fixture.json";
import { fetchResults } from "./fetchResults";

import OakError from "@/errors/OakError";

const mockSuccessResponse = {
  ok: true,
  status: 200,
  json: jest.fn().mockResolvedValue(elasticResponse2023),
  clone: jest.fn().mockReturnValue({
    text: jest.fn().mockResolvedValue(JSON.stringify(elasticResponse2023)),
  }),
} as unknown as Response;

const mockFetch = jest
  .spyOn(global, "fetch")
  .mockResolvedValue(mockSuccessResponse);

jest.mock("@/browser-lib/getBrowserConfig", () => {
  return jest.fn((key: string) => {
    const config: Record<string, string> = {
      clientAppBaseUrl: "http://localhost:3000",
      searchApiUrl2023: "test",
    };
    return config[key] || "test";
  });
});

describe("search-api/2023/fetchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call fetch with correct query", async () => {
    await fetchResults({ term: "test" });

    expect(mockFetch).toHaveBeenCalledWith("test", {
      method: "POST",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      }),
      body: '{"term":"test","legacy":"filterOutAll"}',
    });
  });
  test("should respond with transformed data", async () => {
    const { hitList } = await fetchResults({ term: "test" });
    expect(hitList).toHaveLength(4);
    expect(hitList[0]).toMatchObject({
      _id: "Z38Yx44Bc8iIk5N9Klp6",
      _index: "lessons_1712737230873",
      _score: 104.29718,
    });

    expect(hitList[0]?._source).toMatchObject({
      slug: "the-relationship-between-macbeth-and-lady-macbeth",
      title: "The relationship between Macbeth and Lady Macbeth",
      programme_slug: "english-secondary-ks4-eduqas",
      subject_title: "English",
      subject_slug: "english",
      key_stage_title: "Key Stage 4",
      key_stage_slug: "ks4",
      unit_slug: "macbeth-lady-macbeth-as-a-machiavellian-villain",
      unit_title: "Macbeth: Lady Macbeth as a machiavellian villain",
      pathways: [],
      cohort: "2023-2024",
      type: "lesson",
      pupil_lesson_outcome:
        "I can describe the relationship between Macbeth and Lady Macbeth.",
    });
  });
  test("should throw OakError when response is not ok", async () => {
    const errorBody = JSON.stringify({ error: "Internal Server Error" });
    const mockErrorResponse = {
      ok: false,
      status: 500,
      clone: jest.fn().mockReturnValue({
        text: jest.fn().mockResolvedValue(errorBody),
      }),
    } as unknown as Response;

    mockFetch.mockResolvedValue(mockErrorResponse);

    await expect(fetchResults({ term: "test" })).rejects.toThrow(OakError);
    await expect(fetchResults({ term: "test" })).rejects.toMatchObject({
      code: "search/unknown",
      originalError: 500,
      meta: { body: errorBody },
    });
  });
});
