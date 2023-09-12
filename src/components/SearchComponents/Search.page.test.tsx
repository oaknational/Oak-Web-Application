import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Search from "./Search.page";
import { SearchProps } from "./search.page.types";

import { SearchHit, SearchQuery } from "@/context/Search/search.types";

const createSearchResult = (): SearchHit => {
  return {
    _id: "",
    _index: "",
    _score: 54,
    highlight: {},
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
      key_stage_title: "key stage title",
      key_stage_slug: "key-stage-1",
    },
  };
};

const resultsProps: Partial<SearchProps> = {
  results: [createSearchResult()],
  status: "success",
};

const validQuery: SearchQuery = {
  term: "test search term",
  keyStages: [],
};

const setSearchStartTime = jest.fn();

export const props: SearchProps = {
  status: "not-asked",
  searchStartTime: 1,
  setSearchStartTime: setSearchStartTime,
  results: [],
  query: validQuery,
  setQuery: jest.fn(),
  searchFilters: {
    keyStageFilters: [
      {
        slug: "ks1",
        title: "Key-stage 1",
        shortCode: "KS1",
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
      { slug: "unit", title: "Units", onChange: jest.fn(), checked: false },
    ],
  },
  allKeyStages: [
    {
      slug: "ks1",
      title: "Key-stage 1",
      shortCode: "KS1",
    },
    {
      slug: "ks2",
      title: "Key-stage 2",
      shortCode: "KS2",
    },
    {
      slug: "ks3",
      title: "Key-stage 3",
      shortCode: "KS3",
    },
    {
      slug: "ks4",
      title: "Key-stage 4",
      shortCode: "KS4",
    },
  ],
  setSearchTerm: jest.fn(),
};

const searchCompleted = jest.fn();
const searchAttempted = jest.fn();
jest.mock("../../context/Analytics/useAnalytics.ts", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchCompleted: (...args: unknown[]) => searchCompleted(...args),
      searchAttempted: (...args: unknown[]) => searchAttempted(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("Search.page.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("h1 is “{searchTerm}“ if term prop passed", () => {
    const { getByRole } = render(
      <Search {...props} query={{ ...props.query, term: "test search term" }} />
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "“test search term”"
    );
  });
  test("h1 is Search if 'term' prop not passed", () => {
    const { getByRole } = render(
      <Search {...props} query={{ ...props.query, term: "" }} />
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Search");
  });
  test("status: error message displayed status is fail", () => {
    const { getByRole } = render(<Search {...props} status="fail" />);
    expect(getByRole("status")).toHaveTextContent(
      "There was an error fetching search results"
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
      />
    );
    expect(getByRole("status")).toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if loading", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="loading"
      />
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if resuts not empty", () => {
    const { getByRole } = render(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        results={[createSearchResult()]}
      />
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("results are displayed", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(getByRole("link", { name: "lesson title" })).toBeInTheDocument();
  });
  test("results have correct href", () => {
    const { getByRole } = render(<Search {...props} {...resultsProps} />);
    expect(getByRole("link", { name: "lesson title" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/subject-slug-ks1/units/topic-slug/lessons/lesson-slug"
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
    const submit = getByRole("button", { name: "Submit" });
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
    expect(getByRole("button", { name: "Submit" })).toHaveFocus();
  });
  test("clicking result description clicks the link", async () => {
    const { getByText, getByRole } = render(
      <Search {...props} {...resultsProps} />
    );
    const description = getByText("lesson description");
    const user = userEvent.setup();
    const link = getByRole("link", { name: "lesson title" });
    const onLinkClick = jest.fn();
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        onLinkClick();
      },
      false
    );
    await user.click(description);

    expect(onLinkClick).toHaveBeenCalled();
  });
  test("clicking a calls filter.onChange appropriately for key stage filters", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const ks1OnChange = props.searchFilters.keyStageFilters.find(
      (ks) => ks.slug === "ks1"
    )?.onChange as jest.Mock;
    ks1OnChange.mockClear();
    await user.click(getByRole("button", { name: "Filters" }));
    const filter = getByRole("checkbox", { name: "KS1 filter" });
    if (!filter) {
      throw new Error("Expected filter to exist");
    }
    await user.click(filter);
    await waitFor(() => expect(ks1OnChange).toHaveBeenCalledTimes(1));
  });
  test("clicking a calls filter.onChange appropriately for subject filters", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const computingOnChange = props.searchFilters.subjectFilters.find(
      (c) => c.slug === "computing"
    )?.onChange as jest.Mock;
    computingOnChange.mockClear();
    await user.click(getByRole("button", { name: "Filters" }));
    const filter = getByRole("checkbox", { name: "Computing filter" });
    if (!filter) {
      throw new Error("Expected filter to exist");
    }
    await user.click(filter);
    await waitFor(() => expect(computingOnChange).toHaveBeenCalledTimes(1));
  });
  test("clicking a calls filter.onChange appropriately for contentType filters", async () => {
    const { getByRole } = render(<Search {...props} />);
    const user = userEvent.setup();
    const typeOnChange = props.searchFilters.contentTypeFilters.find(
      (t) => t.slug === "unit"
    )?.onChange as jest.Mock;
    typeOnChange.mockClear();
    await user.click(getByRole("button", { name: "Filters" }));
    const filter = getByRole("checkbox", { name: "Units filter" });
    if (!filter) {
      throw new Error("Expected filter to exist");
    }
    await user.click(filter);
    await waitFor(() => expect(typeOnChange).toHaveBeenCalledTimes(1));
  });
  test("searchCompleted is called when a search is completed with success status", async () => {
    render(<Search {...props} {...resultsProps} />);
    await waitFor(() => expect(searchCompleted).toHaveBeenCalledTimes(1));
  });
  test("searchCompleted is called when a search is completed with fail status", async () => {
    render(<Search {...{ ...props, status: "fail" }} {...resultsProps} />);
    await waitFor(() => expect(searchCompleted).toHaveBeenCalledTimes(1));
  });
  test("searchCompleted is not called when status is not asked", async () => {
    render(<Search {...props} />);
    await waitFor(() => expect(searchCompleted).not.toHaveBeenCalled());
  });
  test("searchCompleted is not called when status is loading", async () => {
    render(<Search {...{ ...props, status: "loading" }} />);
    await waitFor(() => expect(searchCompleted).not.toHaveBeenCalled());
  });
  test("setSearchStartTime is called with performance.now() when query.term is truthy", () => {
    render(<Search {...props} {...resultsProps} />);

    expect(setSearchStartTime).toHaveBeenCalledTimes(1);
  });
});
