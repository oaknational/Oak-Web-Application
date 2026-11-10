import SearchPage from "./page";

import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const mockSearchPage = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    searchPage: (...args: []) => mockSearchPage(args),
  },
}));

const mockResult = {
  _id: "test-1",
  _index: "lessons_1712737230873",
  _score: 104.29718,
  _source: {
    id: 1,
    slug: "test-lesson",
    title: "Test Lesson",
    programme_slug: "english-secondary-ks4",
    subject_title: "English",
    subject_slug: "english",
    key_stage_title: "Key Stage 4",
    key_stage_slug: "ks4",
    unit_slug: "test-unit",
    unit_title: "Test Unit",
    type: "lesson" as const,
    pupil_lesson_outcome: "Test outcome",
    lesson_description: null,
    has_copyright_material: null,
    expired: null,
    theme_title: null,
    tier: null,
    phase: null,
    year_slug: "year-10",
    year_title: "Year 10",
    topic_title: null,
    topic_slug: null,
    pathways: [],
    cohort: "2023-2024",
  },
  highlight: {
    pupil_lesson_outcome: "Test <b>outcome</b>",
  },
};

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

const mockFetchResults = jest.fn();
jest.mock("@/context/Search/search-api/2023/fetchResults", () => ({
  fetchResults: () => mockFetchResults,
}));

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

describe("Search page", () => {
  beforeEach(() => {
    mockSearchPage.mockResolvedValue(searchPageFixture());
    mockFetchResults.mockResolvedValue({
      hitList: [mockResult],
      took: 10,
    });
  });
  it("renders correctly", async () => {
    const result = await SearchPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({ term: "search" }),
    });

    expect(result).toMatchSnapshot();
  });
});
