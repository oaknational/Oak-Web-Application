import { describe, expect, it } from "vitest";
/**
 * @jest-environment jsdom
 */
import React from "react";
import { act } from "react-dom/test-utils";

import SearchResults from "./SearchResults";

import elasticResponseFixture from "@/context/Search/elasticResponse.2020.fixture.json";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api/fixtures/searchPage.fixture";
import truthy from "@/utils/truthy";
import { searchResultsHitsSchema } from "@/context/Search/search.schema";

const hits = searchResultsHitsSchema.parse(elasticResponseFixture.hits.hits);

const getNHits = (n: number) => {
  const [hit] = hits.map((hit) => {
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
  hits,
  allKeyStages: searchPageFixture().keyStages,
};

const searchResultOpened = vi.fn();
const searchResultExpanded = vi.fn();

const render = renderWithProviders();

describe("<SearchResults />", () => {
  it("A lesson search result links to the lesson listing page", () => {
    const { getByRole } = render(
      <SearchResults
        {...props}
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
      />,
    );
    expect(
      getByRole("link", {
        name: "English lesson: To write the setting description",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-primary-ks2/units/macbeth-narrative-writing-9566/lessons/to-write-the-setting-description-c8u34r",
    );
  });
  // @todo when we have programme_slug in search index
  it("A unit search result links to the unit listing page", () => {
    const { getByRole } = render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
        hits={props.hits.filter((hit) => hit._source.type === "unit")}
      />,
    );
    expect(
      getByRole("link", { name: "English unit: Macbeth - unit" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4-core/units/macbeth-narrative-writing-core/lessons",
    );
  });

  it("it renders the search results", () => {
    const { getAllByRole } = render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
      />,
    );

    const searchElement = getAllByRole("listitem");

    expect(searchElement.length).toEqual(20);
  });

  it("it renders pagination if there are more results than 20 results", () => {
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
  it("it does not render pagination if there are 20 results", () => {
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
  it("search results clicked is called when a search result is clicked", () => {
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
      name: "Drama lesson: Dipping into Macbeth - Brave Macbeth (Part 2)",
    });
    act(() => {
      searchHit.click();
    });

    expect(searchResultOpened).toHaveBeenCalled();
  });
});
