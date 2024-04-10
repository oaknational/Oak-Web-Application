/**
 * @jest-environment jsdom
 */
import React from "react";
import { act } from "react-dom/test-utils";

import SearchResults from "./SearchResults";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api/fixtures/searchPage.fixture";
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

describe("<SearchResults />", () => {
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
        name: "English lesson: The relationship between Macbeth and Lady Macbeth",
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
        name: "English unit: Macbeth: Lady Macbeth as a machiavellian villain",
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
      name: "English lesson: The relationship between Macbeth and Lady Macbeth",
    });
    act(() => {
      searchHit.click();
    });

    expect(searchResultOpened).toHaveBeenCalled();
  });
});
