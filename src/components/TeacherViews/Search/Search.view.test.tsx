import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import Search from "./Search.view";
import { SearchProps } from "./search.view.types";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SearchHit, SearchQuery } from "@/context/Search/search.types";

const createSearchResult = (): SearchHit => {
  return {
    _id: "",
    _index: "",
    _score: 54,
    highlight: {},
    legacy: true,
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
    },
  };
};

const resultsProps: Partial<SearchProps> = {
  results: [createSearchResult()],
  status: "success",
};
const resultsPropsPathWays: Partial<SearchProps> = {
  results: [
    {
      ...createSearchResult(),
      ...{
        _source: {
          ...createSearchResult()._source,
          pathways: [
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
          ],
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

const setSearchStartTime = vi.fn();

const props: SearchProps = {
  status: "not-asked",
  searchStartTime: 1,
  setSearchStartTime: setSearchStartTime,
  results: [],
  query: validQuery,
  setQuery: vi.fn(),
  searchFilters: {
    keyStageFilters: [
      {
        slug: "ks1",
        title: "Key-stage 1",
        shortCode: "KS1",
        onChange: vi.fn(),
        checked: false,
      },
    ],
    subjectFilters: [
      {
        slug: "computing",
        title: "Computing",
        onChange: vi.fn(),
        checked: false,
      },
    ],
    contentTypeFilters: [
      { slug: "unit", title: "Units", onChange: vi.fn(), checked: false },
    ],
    examBoardFilters: [
      {
        slug: "aqa",
        title: "AQA",
        onChange: vi.fn(),
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
  setSearchTerm: vi.fn(),
};

const searchResultsDisplayed = vi.fn();
const searchAttempted = vi.fn();
const searchResultOpened = vi.fn();
const searchJourneyInitiated = vi.fn();
const searchResultExpanded = vi.fn();

vi.mock("@/context/Analytics/useAnalytics.ts", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchResultsDisplayed: (...args: unknown[]) =>
        searchResultsDisplayed(...args),
      searchAttempted: (...args: unknown[]) => searchAttempted(...args),
      searchJourneyInitiated: (...args: unknown[]) =>
        searchJourneyInitiated(...args),
      searchResultExpanded: (...args: unknown[]) =>
        searchResultExpanded(...args),
      searchResultOpened: (...args: unknown[]) => searchResultOpened(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("Search.page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("status: error message displayed status is fail", () => {
    const { getByRole } = render(<Search {...props} status="fail" />);
    expect(getByRole("status")).toHaveTextContent(
      "There was an error fetching search results",
    );
  });
  it("status: loading not displayed if not passed", () => {
    const { getByRole } = render(<Search {...props} />);
    expect(getByRole("status")).not.toHaveTextContent("Loading");
  });
  it("status: loading displayed if passed", () => {
    const { getByRole } = render(<Search {...props} status="loading" />);
    expect(getByRole("status")).toHaveTextContent("Loading");
  });
  it("status: 'no results' message displayed if no results and status==='success'", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="success"
      />,
    );
    expect(getByRole("status")).toHaveTextContent("No search results");
  });
  it("status: 'no results' message not displayed if loading", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="loading"
      />,
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  it("status: 'no results' message not displayed if results not empty", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        results={[createSearchResult()]}
      />,
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  it("results are displayed", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(
      getByRole("link", { name: "subject title lesson: lesson title" }),
    ).toBeInTheDocument();
  });
  it("results have correct href", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(
      getByRole("link", { name: "subject title lesson: lesson title" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/subject-slug-ks1-l/units/topic-slug/lessons/lesson-slug",
    );
  });
  it("search term is set on enter", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const setSearchTerm = props.setSearchTerm as jest.Mock;
    setSearchTerm.mockClear();
    getByRole("searchbox").focus();
    await act(async () => {
      await user.keyboard("macb");
      await user.keyboard("{Enter}");
    });
    expect(setSearchTerm).toHaveBeenCalledTimes(1);
  });
  it("query is set on submit button click", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const setSearchTerm = props.setSearchTerm as jest.Mock;
    setSearchTerm.mockClear();
    const submit = getByRole("button", { name: "Submit" });
    await act(async () => {
      await user.click(submit);
    });
    expect(setSearchTerm).toHaveBeenCalledTimes(1);
  });
  it("tab order, 1: search input", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const searchInput = getByRole("searchbox");
    await act(async () => {
      await user.tab();
    });
    expect(searchInput).toHaveFocus();
  });
  it("tab order, 2: submit button", async () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);

    const user = userEvent.setup();
    await act(async () => {
      await user.tab();
      await user.tab();
    });
    expect(getByRole("button", { name: "Submit" })).toHaveFocus();
  });
  it("clicking result description clicks the link", async () => {
    const { getByText, getByRole } = render(
      <Search {...props} {...resultsProps} />,
    );
    const description = getByText("lesson description");
    const user = userEvent.setup();
    const link = getByRole("link", {
      name: "subject title lesson: lesson title",
    });
    const onLinkClick = vi.fn();
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        onLinkClick();
      },
      false,
    );
    await act(async () => {
      await user.click(description);
    });

    expect(onLinkClick).toHaveBeenCalled();
  });

  it("searchResultsDisplayed is called when a search is completed with success status", async () => {
    render(<Search {...props} {...resultsProps} />);
    await waitFor(() =>
      expect(searchResultsDisplayed).toHaveBeenCalledTimes(1),
    );
  });
  it("searchResultsDisplayed is called when a search is completed with fail status", async () => {
    render(<Search {...{ ...props, status: "fail" }} {...resultsProps} />);
    await waitFor(() =>
      expect(searchResultsDisplayed).toHaveBeenCalledTimes(1),
    );
  });
  it("searchResultsDisplayed is not called when status is not asked", async () => {
    render(<Search {...props} />);
    await waitFor(() => expect(searchResultsDisplayed).not.toHaveBeenCalled());
  });
  it("searchResultsDisplayed is not called when status is loading", async () => {
    render(<Search {...{ ...props, status: "loading" }} />);
    await waitFor(() => expect(searchResultsDisplayed).not.toHaveBeenCalled());
  });
  it("setSearchStartTime is called with performance.now() when query.term is truthy", () => {
    render(<Search {...props} {...resultsProps} />);

    expect(setSearchStartTime).toHaveBeenCalledTimes(1);
  });
  it("searchResultOpened is called when a search hit is clicked", async () => {
    const { getByText } = render(<Search {...props} {...resultsProps} />);
    const description = getByText("lesson title");
    const user = userEvent.setup();
    await act(async () => {
      await user.click(description);
    });

    expect(searchResultOpened).toHaveBeenCalledTimes(1);
    expect(searchResultOpened).toHaveBeenCalledWith({
      analyticsUseCase: null,
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
    });
  });
  it("searchResultClicked is called when a pathway hit is clicked", async () => {
    const { getByText } = render(
      <Search {...props} {...resultsPropsPathWays} />,
    );
    const dropdown = getByText("Select exam board");
    const user = userEvent.setup();
    await act(async () => {
      await user.click(dropdown);
    });

    const link = getByText("Exam Board 1 Higher");
    await act(async () => {
      await user.click(link);
    });

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
    });
  });
  it("searchResultExpanded is called when a dropdown toggle is expanded", async () => {
    const { getByText } = render(
      <Search {...props} {...resultsPropsPathWays} />,
    );
    const dropdown = getByText("Select exam board");
    const user = userEvent.setup();
    await act(async () => {
      await user.click(dropdown);
    });

    expect(searchResultExpanded).toHaveBeenCalledTimes(1);
    expect(searchResultExpanded).toHaveBeenCalledWith({
      context: "search",
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
    });
  });
});
