import elasticResponse2023 from "./elasticResponse.2023.fixture.json";
import { fetchResults } from "./fetchResults";

const mockResponse = {
  json: jest.fn().mockResolvedValue(elasticResponse2023),
} as unknown as Response;

const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

const mockHandleFetchError = jest.fn();

jest.mock("@/browser-lib/getBrowserConfig", () => () => "test");
jest.mock("@/utils/handleFetchError", () => () => mockHandleFetchError);

describe("search-api/2023/fetchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call fetch with correct query", async () => {
    await fetchResults({ term: "test" });

    expect(mockFetch).toHaveBeenCalledWith("test", {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: '{"term":"test"}',
    });
  });
  test.only("should respond with transformed data", async () => {
    const results = await fetchResults({ term: "test" });
    expect(results).toHaveLength(4);
    expect(results[0]).toMatchObject({
      _id: "Z38Yx44Bc8iIk5N9Klp6",
      _index: "lessons_1712737230873",
      _score: 104.29718,
    });

    expect(results[0]?._source).toMatchObject({
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
});
