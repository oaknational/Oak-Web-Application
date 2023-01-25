/**
 * @jest-environment jsdom
 */
import React from "react";

import { SearchHit, UnitSearchHit } from "../../pages/beta/teachers/search";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SearchResults, { getLessonObject, getUnitObject } from "./SearchResults";

export const searchResults: Array<SearchHit> = [
  {
    _source: {
      id: 4097,
      type: "lesson",
      slug: "number-systems-binary-the-language-of-computers-68tkee",
      title: "Number systems: Binary - the language of computers",
      lesson_description:
        "In this lesson, we will be exploring the binary code and its use in computing.",
      topic_title: "Different number systems",
      theme_title: "",
      topic_slug: "different-number-systems-77bd",
      subject_title: "Maths",
      subject_slug: "maths",
      key_stage_title: "Key Stage 3",
      key_stage_slug: "key-stage-3",
      year_title: "Year 7",
      year_slug: "year-7",
      is_sensitive: false,
      is_specialist: null,
    },
  },
  {
    _source: {
      id: 4178,
      type: "unit",
      slug: "computing-systems-1558",
      title: "Computing systems",
      subject_title: "Computing",
      subject_slug: "computing",
      theme_title: "computing",
      key_stage_title: "Key Stage 3",
      key_stage_slug: "key-stage-3",
      year_slug: "year-8",
      is_specialist: false,
      is_sensitive: false,
    },
  },
];

export const searchResult: SearchHit = {
  _source: {
    id: 4097,
    type: "lesson",
    slug: "number-systems-binary-the-language-of-computers-68tkee",
    title: "Number systems: Binary - the language of computers",
    lesson_description:
      "In this lesson, we will be exploring the binary code and its use in computing.",
    topic_title: "Different number systems",
    theme_title: "",
    topic_slug: "different-number-systems-77bd",
    subject_title: "Maths",
    subject_slug: "maths",
    key_stage_title: "Key Stage 3",
    key_stage_slug: "key-stage-3",
    year_title: "Year 7",
    year_slug: "year-7",
    is_sensitive: false,
    is_specialist: null,
  },
};

describe("The <SearchForm> Component", () => {
  test("A unit search result links to the lesson listing page", () => {
    const { getByText } = renderWithProviders(
      <SearchResults hits={searchResults} />
    );

    expect(getByText("Computing systems").closest("a")).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks3/subjects/computing/units/computing-systems-1558"
    );
  });

  test("A lesson search result links to the lesson overview page", () => {
    const { getByText } = renderWithProviders(
      <SearchResults hits={searchResults} />
    );

    expect(
      getByText("Number systems: Binary - the language of computers").closest(
        "a"
      )
    ).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks3/subjects/maths/units/different-number-systems-77bd/lessons/number-systems-binary-the-language-of-computers-68tkee"
    );
  });

  test("it renders the search results", () => {
    const { getAllByRole } = renderWithProviders(
      <SearchResults hits={searchResults} />
    );

    const searchElement = getAllByRole("listitem");

    expect(searchElement.length).toEqual(2);
  });

  test("getLessonObject maps to new key stage slug", () => {
    const lessonListObject = getLessonObject(searchResult);

    expect(lessonListObject.keyStageSlug).toEqual("ks3");
  });

  test("getUnitObject maps to new key stage slug", () => {
    const unitListObject = getUnitObject(searchResults[1] as UnitSearchHit);

    expect(unitListObject.keyStageSlug).toEqual("ks3");
  });

  test("it renders pagination if there are more results than set in RESULTS_PER_PAGE", () => {
    const hits = [];
    const RESULTS_PER_PAGE = 20;

    const searchResult: SearchHit = {
      _source: {
        id: 4097,
        type: "lesson",
        slug: "number-systems-binary-the-language-of-computers-68tkee",
        title: "Number systems: Binary - the language of computers",
        lesson_description:
          "In this lesson, we will be exploring the binary code and its use in computing.",
        topic_title: "Different number systems",
        theme_title: "",
        topic_slug: "different-number-systems-77bd",
        subject_title: "Maths",
        subject_slug: "maths",
        key_stage_title: "Key Stage 3",
        key_stage_slug: "key-stage-3",
        year_title: "Year 7",
        year_slug: "year-7",
        is_sensitive: false,
        is_specialist: null,
      },
    };

    for (let i = 0; i <= RESULTS_PER_PAGE; i++) {
      hits.push({ _source: { ...searchResult._source, id: i } });
    }

    const { getByRole } = renderWithProviders(<SearchResults hits={hits} />);

    const pagination = getByRole("navigation");

    expect(pagination).toBeInTheDocument();
  });
});
