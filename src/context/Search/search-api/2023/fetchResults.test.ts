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
      body: '{"from":0,"size":100,"query":{"bool":{"should":[{"multi_match":{"query":"test","type":"phrase","analyzer":"stop","fields":["lessonTitle^6","unitTitle^6","lessonDescription^3","lessons.lessonTitle^3"]}},{"multi_match":{"query":"test","fields":["*"],"type":"most_fields","analyzer":"stop","fuzziness":"AUTO:4,7","prefix_length":1}}],"filter":[],"minimum_should_match":1}},"highlight":{"number_of_fragments":0,"pre_tags":["<b>"],"post_tags":["</b>"],"fields":{}}}',
    });
  });
  test("should respond with transformed data", async () => {
    const results = await fetchResults({ term: "test" });

    expect(results).toHaveLength(20);
    expect(results[0]).toMatchObject({
      _id: "5KnzTocBd235CCw7oqe1",
      _index: "lessons_test",
      _score: 121.737686,
    });

    expect(results[0]?._source).toMatchObject({
      id: 211319,
      slug: "dipping-into-macbeth-brave-macbeth-part-2-crvkad",
      title: "Dipping into Macbeth - Brave Macbeth (Part 2)\n",
      subject_title: "Drama",
      subject_slug: "drama",
      key_stage_title: "Key Stage 2",
      key_stage_slug: "key-stage-2",
      unit_slug: "dipping-into-shakespeare-da5e",
      unit_title: "Dipping into Shakespeare",
      theme_title: null,
      tier: null,
      phase: "primary",
      type: "lesson",
      lesson_description:
        "In this lesson we are introduced to Macbeth and Banquo. We will explore the characters' thoughts and feelings and how they respond when they encounter the witches.",
    });
  });
});
