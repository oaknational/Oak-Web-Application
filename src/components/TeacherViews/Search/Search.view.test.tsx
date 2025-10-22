import { forwardRef } from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

import Search from "./Search.view";
import { SearchProps } from "./search.view.types";

import * as useSuggestedFiltersModule from "@/context/Search/useSuggestedFilters";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SearchHit, SearchQuery } from "@/context/Search/search.types";
import { LEGACY_COHORT } from "@/config/cohort";
import {
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef(() => {
    return <div data-testid="mux-player-mock" />;
  });
});
const searchRefined = jest.fn();

const createSearchResult = (legacy?: boolean): SearchHit => {
  return {
    _id: "",
    _index: "",
    _score: 54,
    highlight: {},
    legacy: legacy ?? true,
    _source: {
      type: "lesson",
      lesson_description: "lesson description",
      topic_title: "topic title1 ",
      topic_slug: "topic-slug",
      id: 7,
      slug: "lesson-slug",
      title: "lesson title",
      subject_title: "subject title",
      subject_slug: "subject-slug",
      key_stage_title: "key stage 1",
      key_stage_slug: "key-stage-1",
      pathways: [],
      cohort: LEGACY_COHORT,
    },
  };
};

const resultsProps: Partial<SearchProps> = {
  results: [createSearchResult()],
  status: "success",
};

const pathways = [
  {
    programme_slug: "maths-program-1",
    unit_slug: "algebra-unit-1",
    unit_title: "Algebra",
    key_stage_slug: "ks3",
    key_stage_title: "Key stage 3",
    subject_slug: "maths",
    subject_title: "Mathematics",
    tier_slug: "higher",
    tier_title: "Higher",
    exam_board_slug: "exam-board-1",
    exam_board_title: "Exam Board 1",
    year_slug: "2023",
    year_title: "2023-2024",
  },
  {
    programme_slug: "maths-program-1",
    unit_slug: "algebra-unit-2",
    unit_title: "Algebra",
    key_stage_slug: "ks3",
    key_stage_title: "Key stage 3",
    subject_slug: "maths",
    subject_title: "Mathematics",
    tier_slug: "higher",
    tier_title: "Higher",
    exam_board_slug: "exam-board-2",
    exam_board_title: "Exam Board 2",
    year_slug: "2023",
    year_title: "2023-2024",
  },
];

const resultsPropsPathWays: Partial<SearchProps> = {
  results: [
    {
      ...createSearchResult(),
      ...{
        _source: {
          ...createSearchResult()._source,
          pathways,
        },
      },
    },
  ],
  status: "success",
};

const validQuery: SearchQuery = {
  term: "test search term",
  keyStages: [],
};

const setSearchStartTime = jest.fn();

const onChange = jest.fn();

const props: SearchProps = {
  status: "not-asked",
  searchStartTime: 1,
  setSearchStartTime: setSearchStartTime,
  results: [],
  query: validQuery,
  setQuery: jest.fn(),
  searchFilters: {
    legacyFilter: {
      slug: "new",
      title: "Show new only",
      onChange: jest.fn(),
      checked: false,
    },
    keyStageFilters: [
      {
        slug: "ks1",
        title: "Key-stage 1",
        shortCode: "KS1",
        onChange: jest.fn(),
        checked: false,
      },
    ],
    yearGroupFilters: [
      {
        slug: "year-10",
        title: "Year 10",
        onChange: jest.fn(),
        checked: false,
      },
    ],
    subjectFilters: [
      {
        slug: "computing",
        title: "Computing",
        onChange: jest.fn(),
        checked: false,
      },
    ],
    contentTypeFilters: [
      { slug: "unit", title: "Units", onChange: onChange, checked: false },
    ],
    examBoardFilters: [
      {
        slug: "aqa",
        title: "AQA",
        onChange: jest.fn(),
        checked: false,
      },
    ],
  },
  allKeyStages: [
    {
      slug: "ks1",
      title: "Key stage 1",
      shortCode: "KS1",
    },
    {
      slug: "ks2",
      title: "Key stage 2",
      shortCode: "KS2",
    },
    {
      slug: "ks3",
      title: "Key stage 3",
      shortCode: "KS3",
    },
    {
      slug: "ks4",
      title: "Key stage 4",
      shortCode: "KS4",
    },
  ],
  setSearchTerm: jest.fn(),
};

const searchAttempted = jest.fn();
const searchResultOpened = jest.fn();
const searchJourneyInitiated = jest.fn();
const searchResultExpanded = jest.fn();
const searchAccessed = jest.fn();
const searchFilterModified = jest.fn();

jest.mock("@/context/Analytics/useAnalytics.ts", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchAttempted: (...args: unknown[]) => searchAttempted(...args),
      searchJourneyInitiated: (...args: unknown[]) =>
        searchJourneyInitiated(...args),
      searchResultExpanded: (...args: unknown[]) =>
        searchResultExpanded(...args),
      searchResultOpened: (...args: unknown[]) => searchResultOpened(...args),
      searchRefined: (...args: []) => searchRefined(...args),
      searchAccessed: (...args: unknown[]) => searchAccessed(...args),
      searchFilterModified: (...args: unknown[]) =>
        searchFilterModified(...args),
    },
  }),
}));

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

jest.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

const mockAiSearchFlagEnabled = jest.fn().mockReturnValue(false);
jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => mockAiSearchFlagEnabled(),
}));

jest.mock("@/context/Search/useSuggestedFilters.tsx");

const render = renderWithProviders();

describe("Search.page.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.setCurrentUrl("/teachers/search");
    setupMockLinkClick();
    (
      useSuggestedFiltersModule.useSuggestedFilters as jest.Mock
    ).mockReturnValue({
      status: "success",
      searchFilters: [{ type: "subject", slug: "maths", value: "Maths" }],
    });
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  test("status: error message displayed status is fail", () => {
    const { getByRole } = render(<Search {...props} status="fail" />);
    expect(getByRole("status")).toHaveTextContent(
      "There was an error fetching search results",
    );
  });
  test("status: loading not displayed if not passed", () => {
    const { getByRole } = render(<Search {...props} />);
    expect(getByRole("status")).not.toHaveTextContent("Loading");
  });
  test("status: loading displayed if passed", () => {
    const { getByRole } = render(<Search {...props} status="loading" />);
    expect(getByRole("status")).toHaveTextContent("Loading");
  });
  test("status: 'no results' message displayed if no results and status==='success'", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="success"
      />,
    );
    expect(getByRole("status")).toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if loading", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="loading"
      />,
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if results not empty", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        results={[createSearchResult()]}
      />,
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("results are displayed", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(
      getByRole("link", { name: "See lesson: lesson title" }),
    ).toBeInTheDocument();
  });
  test("results have correct href", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(
      getByRole("link", { name: "See lesson: lesson title" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/subject-slug-ks1-l/units/topic-slug/lessons/lesson-slug",
    );
  });
  test("search term is set on enter", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const setSearchTerm = props.setSearchTerm as jest.Mock;
    setSearchTerm.mockClear();
    getByRole("searchbox").focus();
    await user.keyboard("macb");
    await user.keyboard("{Enter}");
    expect(setSearchTerm).toHaveBeenCalledTimes(1);
  });
  test("query is set on submit button click", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const setSearchTerm = props.setSearchTerm as jest.Mock;
    setSearchTerm.mockClear();
    const submit = getByRole("button", { name: "submit" });
    await user.click(submit);
    expect(setSearchTerm).toHaveBeenCalledTimes(1);
  });
  test("tab order, 1: search input", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const searchInput = getByRole("searchbox");
    await user.tab();
    expect(searchInput).toHaveFocus();
  });
  test("tab order, 2: submit button", async () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);

    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    const submitButton = getByRole("button", { name: "submit" });

    expect(submitButton).toHaveFocus();
  });
  test("clicking result description clicks the link", async () => {
    const { getByText, getByRole } = render(
      <Search {...props} {...resultsProps} />,
    );
    const description = getByText("lesson description");
    const user = userEvent.setup();
    const link = getByRole("link", {
      name: "See lesson: lesson title",
    });
    const onLinkClick = jest.fn();
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        onLinkClick();
      },
      false,
    );
    await user.click(description);

    expect(onLinkClick).toHaveBeenCalled();
  });

  test("setSearchStartTime is called with performance.now() when query.term is truthy", () => {
    render(<Search {...props} {...resultsProps} />);

    expect(setSearchStartTime).toHaveBeenCalledTimes(1);
  });
  test("searchResultOpened is called when a search hit is clicked", async () => {
    const { getByText } = render(<Search {...props} {...resultsProps} />);
    const description = getByText("lesson title");
    const onLinkClick = jest.fn();
    description.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        onLinkClick();
      },
      false,
    );
    fireEvent.click(description);
    expect(onLinkClick).toHaveBeenCalled();

    expect(searchResultOpened).toHaveBeenCalledTimes(1);
    expect(searchResultOpened).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      lessonName: "lesson title",
      lessonSlug: "lesson-slug",
      searchFilterOptionSelected: [],
      searchRank: 1,
      searchResultCount: 1,
      searchResultType: "lesson",
      subjectSlug: "subject-slug",
      subjectTitle: "subject title",
      unitName: "topic title1 ",
      unitSlug: "topic-slug",
      context: "search",
      lessonReleaseCohort: "2020-2023",
      lessonReleaseDate: "2020-2023",
    });
  });
  test("searchResultClicked is called when a pathway hit is clicked", async () => {
    const { getByText } = render(
      <Search {...props} {...resultsPropsPathWays} />,
    );
    const dropdown = getByText("Select exam board");
    const user = userEvent.setup();
    await user.click(dropdown);

    const link = getByText("Exam Board 1 Higher");
    await user.click(link);

    expect(searchResultOpened).toHaveBeenCalledTimes(1);
    expect(searchResultOpened).toHaveBeenCalledWith({
      context: "search",
      analyticsUseCase: "Teacher",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      lessonName: "lesson title",
      lessonSlug: "lesson-slug",
      searchFilterOptionSelected: [],
      searchRank: 1,
      searchResultCount: 1,
      searchResultType: "lesson",
      subjectSlug: "subject-slug",
      subjectTitle: "subject title",
      unitName: "topic title1 ",
      unitSlug: "topic-slug",
      lessonReleaseCohort: "2020-2023",
      lessonReleaseDate: "2020-2023",
    });
  });
  test("searchResultExpanded is called when a dropdown toggle is expanded", async () => {
    const noneLegacyResultsPropsPathWays: Partial<SearchProps> = {
      results: [
        {
          ...createSearchResult(false),
          ...{
            _source: {
              ...createSearchResult(false)._source,
              pathways,
            },
          },
        },
      ],
      status: "success",
    };
    const { getByText } = render(
      <Search {...props} {...noneLegacyResultsPropsPathWays} />,
    );
    const dropdown = getByText("Select exam board");
    fireEvent.click(dropdown);

    expect(searchResultExpanded).toHaveBeenCalledTimes(1);
    expect(searchResultExpanded).toHaveBeenCalledWith({
      context: "search",
      analyticsUseCase: "Teacher",
      componentType: "search_result_item",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      platform: "owa",
      product: "teacher lesson resources",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      lessonName: "lesson title",
      lessonSlug: "lesson-slug",
      searchFilterOptionSelected: [],
      searchRank: 1,
      searchResultCount: 1,
      searchResultType: "lesson",
      subjectSlug: "subject-slug",
      subjectTitle: "subject title",
      unitName: "topic title1 ",
      unitSlug: "topic-slug",
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "2023-2026",
    });
  });
  test("searchResultExpanded and handles tracking for none legacy lessons", async () => {
    const { getByText } = render(
      <Search {...props} {...resultsPropsPathWays} />,
    );
    const dropdown = getByText("Select exam board");
    fireEvent.click(dropdown);

    expect(searchResultExpanded).toHaveBeenCalledTimes(1);
    expect(searchResultExpanded).toHaveBeenCalledWith({
      context: "search",
      analyticsUseCase: "Teacher",
      componentType: "search_result_item",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      platform: "owa",
      product: "teacher lesson resources",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      lessonName: "lesson title",
      lessonSlug: "lesson-slug",
      searchFilterOptionSelected: [],
      searchRank: 1,
      searchResultCount: 1,
      searchResultType: "lesson",
      subjectSlug: "subject-slug",
      subjectTitle: "subject title",
      unitName: "topic title1 ",
      unitSlug: "topic-slug",
      lessonReleaseCohort: "2020-2023",
      lessonReleaseDate: "2020-2023",
    });
  });
  test("searchRefined function invoked when checked", () => {
    mockRouter.query = { subjects: ["english"] };
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    const unitsFilter = getByRole("checkbox", {
      name: "Units filter",
    });
    unitsFilter.click();
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(searchRefined).toHaveBeenCalledWith({
      activeFilters: { subjects: "english" },
      analyticsUseCase: "Teacher",
      componentType: "filter_link",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      platform: "owa",
      product: "teacher lesson resources",
      searchResultCount: 1,
      searchTerm: "test search term",
    });
  });
  test("skip button becomes visible when focussed", async () => {
    const { getByText } = render(
      <Search {...props} {...resultsPropsPathWays} />,
    );

    const skipButton = getByText("Skip to results").closest("a");

    if (!skipButton) {
      throw new Error("Could not find filter button");
    }
    expect(skipButton).not.toBeVisible();

    act(() => {
      skipButton.focus();
    });
    expect(skipButton).toHaveFocus();
    expect(skipButton).not.toHaveStyle("position: absolute");

    act(() => {
      skipButton.blur();
    });
    expect(skipButton).not.toHaveFocus();
    expect(skipButton).not.toBeVisible();
  });
  test("shows suggested filters when ai flag enabled", () => {
    mockAiSearchFlagEnabled.mockReturnValue("search-with-ai");
    (
      useSuggestedFiltersModule.useSuggestedFilters as jest.Mock
    ).mockReturnValue({
      status: "success",
      searchFilters: [{ type: "subject", slug: "maths", value: "Maths" }],
    });

    render(<Search {...props} {...resultsPropsPathWays} />);
    const suggestedFiltersHeading = screen.getAllByText("Suggested filters");
    expect(suggestedFiltersHeading[0]).toBeInTheDocument();
  });
  test("shows all filters drop down when ai search enabled", () => {
    mockAiSearchFlagEnabled.mockReturnValue("search-with-ai");
    render(<Search {...props} {...resultsPropsPathWays} />);
    const suggestedFiltersHeading = screen.getAllByText("All filters");
    expect(suggestedFiltersHeading[0]).toBeInTheDocument();
  });
  test("shows loading spinner when suggested filters are loading", () => {
    mockAiSearchFlagEnabled.mockReturnValue("search-with-ai");
    (
      useSuggestedFiltersModule.useSuggestedFilters as jest.Mock
    ).mockReturnValue({
      status: "loading",
      searchFilters: [],
    });
    render(<Search {...props} {...resultsPropsPathWays} />);
    const loadingSpinner = screen.getByText("Loading filters");
    expect(loadingSpinner).toBeInTheDocument();
  });
});
