import userEvent from "@testing-library/user-event";

import { SearchHit } from "../../context/Search/helpers";
import { SearchQuery } from "../../context/Search/useSearch";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Search, { SearchProps } from "./Search.page";

const createSearchResult = (): SearchHit => {
  return {
    _id: "",
    _index: "",
    _score: 54,
    highlight: {},
    _source: {
      type: "lesson",
      lesson_description: "lesson description",
      topic_title: "topic title",
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
const providers = { theme: {}, menu: {}, router: {}, analytics: {} };

const validQuery: SearchQuery = {
  term: "test search term",
  keyStages: [],
};

const props: SearchProps & { fetchResults: jest.Mock } = {
  fetchResults: jest.fn(),
  status: "not-asked",
  results: [],
  query: validQuery,
  setQuery: jest.fn(),
  keyStageFilters: [
    {
      slug: "ks1",
      title: "Key-stage 1",
      shortCode: "KS1",
      onChange: jest.fn(),
      checked: false,
    },
  ],
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

describe("Search.page.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("h1 is “{searchTerm}“ if term prop passed", () => {
    const { getByRole } = renderWithProviders(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
      />,
      { providers }
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "“test search term”"
    );
  });
  test("h1 is Search if 'term' prop not passed", () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} query={{ ...props.query, term: "" }} />,
      {
        providers,
      }
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Search");
  });
  test("status: error message displayed status is fail", () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} status="fail" />,
      { providers }
    );
    expect(getByRole("status")).toHaveTextContent(
      "There was an error fetching search results"
    );
  });
  test("status: loading not displayed if not passed", () => {
    const { getByRole } = renderWithProviders(<Search {...props} />, {
      providers,
    });
    expect(getByRole("status")).not.toHaveTextContent("Loading");
  });
  test("status: loading displayed if passed", () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} status="loading" />,
      {
        providers,
      }
    );
    expect(getByRole("status")).toHaveTextContent("Loading");
  });
  test("status: 'no results' message displayed if no results and status==='success'", () => {
    const { getByRole } = renderWithProviders(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="success"
      />,
      {
        providers,
      }
    );
    expect(getByRole("status")).toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if loading", () => {
    const { getByRole } = renderWithProviders(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        status="loading"
      />,
      {
        providers,
      }
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("status: 'no results' message not displayed if resuts not empty", () => {
    const { getByRole } = renderWithProviders(
      <Search
        {...props}
        query={{ ...props.query, term: "test search term" }}
        results={[createSearchResult()]}
      />,
      {
        providers,
      }
    );
    expect(getByRole("status")).not.toHaveTextContent("No search results");
  });
  test("results are displayed", () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} {...resultsProps} />,
      {
        providers,
      }
    );
    expect(getByRole("link", { name: "lesson title" })).toBeInTheDocument();
  });
  test("results have correct href", () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} {...resultsProps} />,
      {
        providers,
      }
    );
    expect(getByRole("link", { name: "lesson title" })).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks1/subjects/subject-slug/units/topic-slug/lessons/lesson-slug"
    );
  });
  test("search input is the first tabbable element", async () => {
    const { getByRole } = renderWithProviders(<Search {...props} />, {
      providers,
    });
    const user = userEvent.setup();
    const searchInput = getByRole("searchbox");
    await user.tab();
    expect(searchInput).toHaveFocus();
  });
  test.skip("search is performed on enter", async () => {
    renderWithProviders(<Search {...props} />, {
      providers,
    });
    const user = userEvent.setup();
    props.fetchResults.mockClear();
    await user.keyboard("{Enter}");
    expect(props.fetchResults).toHaveBeenCalledTimes(1);
  });
  test("top result is the third tabbable element", async () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} {...resultsProps} />,
      {
        providers,
      }
    );

    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    expect(getByRole("button", { name: "Submit" })).toHaveFocus();
  });
  test.skip("first result is the third tabbable element", async () => {
    const { getByRole } = renderWithProviders(
      <Search {...props} {...resultsProps} />,
      {
        providers,
      }
    );

    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(getByRole("link", { name: "lesson title" })).toHaveFocus();
  });
  test("clicking result description clicks the link", async () => {
    const { getByText, getByRole } = renderWithProviders(
      <Search {...props} {...resultsProps} />,
      {
        providers,
      }
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
  test.todo("search is performed on submit button click");
});
