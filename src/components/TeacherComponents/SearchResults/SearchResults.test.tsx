/**
 * @jest-environment jsdom
 */
import React, { forwardRef } from "react";
import { screen } from "@testing-library/dom";

import SearchResults from "./SearchResults";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import truthy from "@/utils/truthy";
import { hitsFixture } from "@/context/Search/search-api/2023/searchResults.fixture";

jest.mock("@mux/mux-player-react/lazy", () => {
  return forwardRef((props, ref) => {
    ref; // This prevents warning about ref not being used
    return <div data-testid="mux-player-mock" />;
  });
});
jest.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

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
        name: "See lesson: The relationship between Macbeth and Lady Macbeth",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons/the-relationship-between-macbeth-and-lady-macbeth",
    );
  });

  test("A unit search result links to the unit listing page", async () => {
    render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
        hits={props.hits.filter((hit) => hit._source.type === "unit")}
      />,
    );

    const link = await screen.findByRole("link", {
      name: "See unit: Macbeth: Lady Macbeth as a machiavellian villain",
    });
    expect(link).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons",
    );
  });

  test("it renders the search results", () => {
    const { getAllByTestId } = render(
      <SearchResults
        searchResultOpened={searchResultOpened}
        searchResultExpanded={searchResultExpanded}
        {...props}
      />,
    );

    const searchElement = getAllByTestId("search-list-item");

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
    render(
      <SearchResults
        searchResultExpanded={searchResultExpanded}
        searchResultOpened={searchResultOpened}
        {...props}
        hits={hits}
      />,
    );
    const searchHit = screen.getByText(
      "The relationship between Macbeth and Lady Macbeth",
    );

    searchHit.click();

    expect(searchResultOpened).toHaveBeenCalled();
  });
});
