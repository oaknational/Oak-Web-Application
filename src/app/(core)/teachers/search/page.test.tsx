import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

import Search from "./Search.view";

import { getSearchFilters } from "@/context/Search/getSearchFilters";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const fixture = searchPageFixture();
if (!fixture) {
  throw new Error("Cannot find search page fixture");
}
const keyStages = fixture.keyStages;
const subjects = fixture.subjects;
const contentTypes = fixture.contentTypes;
const examBoards = fixture.examBoards;
const yearGroups = fixture.yearGroups;

jest.mock("next/navigation");
jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagEnabled: () => false,
  useFeatureFlagVariantKey: () => null,
}));

jest.mocked(usePathname).mockReturnValue("/teachers/search");
jest
  .mocked(useSearchParams)
  .mockReturnValue(new URLSearchParams() as unknown as ReadonlyURLSearchParams);

describe("pages/teachers/search.tsx", () => {
  const query = { term: "test" };
  const searchFilters = getSearchFilters({
    allKeyStages: keyStages,
    allYearGroups: yearGroups,
    allSubjects: subjects,
    allContentTypes: contentTypes,
    allExamBoards: examBoards,
    query,
  });

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

  const render = renderWithProviders();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays search heading on desktop", () => {
    const { getByRole } = render(
      <Search
        allKeyStages={keyStages}
        results={[]}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(getByRole("heading", { name: /search/i })).toBeInTheDocument();
  });

  test("renders search results when status is success and results exist", () => {
    const { getByText } = render(
      <Search
        allKeyStages={keyStages}
        results={[mockResult]}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(getByText("Test Lesson")).toBeInTheDocument();
  });

  test("renders no results message when status is success but no results", () => {
    const { getByText } = render(
      <Search
        allKeyStages={keyStages}
        results={[]}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(
      getByText(/sorry, we could not find any results for/i),
    ).toBeInTheDocument();
  });

  test("displays error message when status is fail", () => {
    const { getByText } = render(
      <Search
        allKeyStages={keyStages}
        results={[]}
        query={query}
        status="fail"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(
      getByText(/something went wrong|error|try again/i),
    ).toBeInTheDocument();
  });

  test("has correct content type filters in searchFilters", () => {
    expect(searchFilters.contentTypeFilters).toHaveLength(2);
    expect(searchFilters.contentTypeFilters?.[0]?.title).toBe("Units");
    expect(searchFilters.contentTypeFilters?.[1]?.title).toBe("Lessons");
  });

  test("has correct key stage filters in searchFilters", () => {
    expect(searchFilters.keyStageFilters.length).toBeGreaterThan(0);
    const ks1 = searchFilters.keyStageFilters.find((ks) => ks.slug === "ks1");
    expect(ks1).toBeDefined();
    expect(ks1?.title).toBe("Key stage 1");
  });

  test("has correct year group filters in searchFilters", () => {
    expect(searchFilters.yearGroupFilters.length).toBeGreaterThan(0);
    const year1 = searchFilters.yearGroupFilters.find(
      (yg) => yg.slug === "year-1",
    );
    expect(year1).toBeDefined();
    expect(year1?.title).toBe("Year 1");
  });

  test("has correct examBoard filters in searchFilters", () => {
    expect(searchFilters.examBoardFilters.length).toBeGreaterThan(0);
    const aqa = searchFilters.examBoardFilters.find((eb) => eb.slug === "aqa");
    expect(aqa).toBeDefined();
    expect(aqa?.title).toBe("AQA");
  });

  test("has correct subject filters in searchFilters", () => {
    expect(searchFilters.subjectFilters.length).toBeGreaterThan(0);
    const english = searchFilters.subjectFilters.find(
      (s) => s.slug === "english",
    );
    expect(english).toBeDefined();
    expect(english?.title).toBe("English");
  });

  test("renders SearchFilters component", () => {
    const { getByTestId } = render(
      <Search
        allKeyStages={keyStages}
        results={[mockResult]}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(getByTestId("search-filters")).toBeInTheDocument();
  });

  test("renders SearchForm component", () => {
    const { getByPlaceholderText } = render(
      <Search
        allKeyStages={keyStages}
        results={[]}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(
      getByPlaceholderText(/search by keyword or topic/i),
    ).toBeInTheDocument();
  });

  test("renders multiple results when provided", () => {
    const multipleResults = [
      mockResult,
      {
        ...mockResult,
        _id: "test-2",
        _source: {
          ...mockResult._source,
          slug: "another-lesson",
          title: "Another Lesson",
        },
      },
    ];
    const { getByText } = render(
      <Search
        allKeyStages={keyStages}
        results={multipleResults}
        query={query}
        status="success"
        timeTaken={10}
        searchFilters={searchFilters}
      />,
    );
    expect(getByText("Test Lesson")).toBeInTheDocument();
    expect(getByText("Another Lesson")).toBeInTheDocument();
  });
});
