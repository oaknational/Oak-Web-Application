/**
 * @jest-environment jsdom
 */
import React from "react";

import elasticResponseFixture from "../../context/Search/elasticResponse.2020.fixture.json";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "../../node-lib/curriculum-api/fixtures/searchPage.fixture";
import truthy from "../../utils/truthy";

import SearchResults from "./SearchResults";

import { searchResultsHitsSchema } from "@/context/Search/search.schema";

const hits = searchResultsHitsSchema.parse(elasticResponseFixture.hits.hits);

const getNHits = (n: number) => {
  const [hit] = hits;

  return new Array(n)
    .fill(1)
    .map((_, i) =>
      hit
        ? {
            ...hit,
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

const render = renderWithProviders();

describe("<SearchResults />", () => {
  test("A lesson search result links to the lesson listing page", () => {
    const { getByRole } = render(<SearchResults {...props} />);
    expect(
      getByRole("link", { name: "To write the setting description" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/english-primary-ks2-l/units/macbeth-narrative-writing-9566/lessons/to-write-the-setting-description-c8u34r",
    );
  });
  // @todo when we have programme_slug in search index
  test.skip("A unit search result links to the unit listing page", () => {
    const { getByRole } = render(<SearchResults {...props} />);
    expect(
      getByRole("link", { name: "Macbeth - Narrative writing" }),
    ).toHaveAttribute(
      "href",
      "/teachers/programmes/undefined/units/macbeth-narrative-writing-9566/lessons",
    );
  });

  test("it renders the search results", () => {
    const { getAllByRole } = render(<SearchResults {...props} />);

    const searchElement = getAllByRole("listitem");

    expect(searchElement.length).toEqual(20);
  });

  test("it renders pagination if there are more results than 20 results", () => {
    const hits = getNHits(21);
    const { getByRole } = render(<SearchResults {...props} hits={hits} />);

    const pagination = getByRole("navigation", { hidden: true });

    expect(pagination).toBeInTheDocument();
  });
  test("it does not render pagination if there are 20 results", () => {
    const hits = getNHits(20);
    const { queryByRole } = render(<SearchResults {...props} hits={hits} />);

    const pagination = queryByRole("navigation", { hidden: true });

    expect(pagination).not.toBeInTheDocument();
  });
});
