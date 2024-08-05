/**
 * @jest-environment jsdom
 */
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";

import SearchResults from "./SearchResults";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import truthy from "@/utils/truthy";
import { hitsFixture } from "@/context/Search/search-api/2023/searchResults.fixture";

const getNHits = (n: number) => {
  const [hit] = hitsFixture.map((hit) => {
    return {
      ...hit,
    };
  });

  return new Array(n)
    .fill(1)
    .map((_, i) =>
      hit
        ? {
            ...hit,
            legacy: false,
            // appending i to slug to avoid unique key warning
            _source: { ...hit?._source, slug: hit?._source?.slug + i },
          }
        : null,
    )
    .filter(truthy);
};

const props = {
  hits: hitsFixture,
  allKeyStages: searchPageFixture().keyStages,
};

const searchResultOpened = jest.fn();
const searchResultExpanded = jest.fn();

const render = renderWithProviders();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
describe("<SearchResults />", () => {
  let pushMock: jest.Mock;
  let scrollToMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn().mockResolvedValue(true);
    scrollToMock = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { search: "english" },
      push: pushMock,
      asPath: "/current-path",
      pathname: "/current-path",
    }));
    window.scrollTo = scrollToMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("A lesson search result links to the lesson listing page", () => {
    const { getByRole } = render(
      <SearchResults
        {...props}
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
      />,
    );
    expect(
      getByRole("link", {
        name: "See lesson: The relationship between Macbeth and Lady Macbeth",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons/the-relationship-between-macbeth-and-lady-macbeth",
    );
  });
  // @todo when we have programme_slug in search index
  test("A unit search result links to the unit listing page", () => {
    const { getByRole } = render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
        hits={props.hits.filter((hit) => hit._source.type === "unit")}
      />,
    );
    expect(
      getByRole("link", {
        name: "See unit: Macbeth: Lady Macbeth as a machiavellian villain",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons",
    );
  });

  test("it renders the search results", () => {
    const { getAllByRole } = render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
      />,
    );

    const searchElement = getAllByRole("listitem");

    expect(searchElement.length).toEqual(4);
  });

  test("it renders pagination if there are more results than 20 results", () => {
    const hits = getNHits(21);
    const { getByRole } = render(
      <SearchResults
        searchResultExpanded={searchResultExpanded}
        searchResultOpened={searchResultOpened}
        {...props}
        hits={hits}
      />,
    );

    const pagination = getByRole("navigation", { hidden: true });

    expect(pagination).toBeInTheDocument();
  });
  test("it does not render pagination if there are 20 results", () => {
    const hits = getNHits(20);
    const { queryByRole } = render(
      <SearchResults
        searchResultExpanded={searchResultExpanded}
        searchResultOpened={searchResultOpened}
        {...props}
        hits={hits}
      />,
    );

    const pagination = queryByRole("navigation", { hidden: true });

    expect(pagination).not.toBeInTheDocument();
  });
  test("search results clicked is called when a search result is clicked", () => {
    const hits = getNHits(1);
    const { getByRole } = render(
      <SearchResults
        searchResultExpanded={searchResultExpanded}
        searchResultOpened={searchResultOpened}
        {...props}
        hits={hits}
      />,
    );
    const searchHit = getByRole("link", {
      name: "See lesson: The relationship between Macbeth and Lady Macbeth",
    });
    act(() => {
      searchHit.click();
    });

    expect(searchResultOpened).toHaveBeenCalled();
  });

  test("should navigate to the correct page and scroll to top on page change", async () => {
    const hits = getNHits(40);
    const { getByTestId } = render(
      <SearchResults
        {...props}
        searchResultExpanded={searchResultExpanded}
        searchResultOpened={searchResultOpened}
        hits={hits}
      />,
    );

    const paginationButton = getByTestId("forwards-button");
    fireEvent.click(paginationButton);
    expect(pushMock).toHaveBeenCalledWith(
      {
        query: { page: 2 },
        pathname: "/current-path",
      },
      undefined,
      { shallow: true, scroll: false },
    );

    await pushMock();

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
