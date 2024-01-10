import { ParsedUrlQuery } from "querystring";

import searchPageFixture from "../../node-lib/curriculum-api/fixtures/searchPage.fixture";

import {
  getFilterForQuery,
  getFiltersFromQuery,
  getLessonObject,
  getSortedSearchFiltersSelected,
  getUnitObject,
  isFilterItem,
} from "./search.helpers";
import elasticResponseFixture from "./elasticResponse.2020.fixture.json";
import { lessonSearchHitSchema, unitSearchHitSchema } from "./search.schema";

const lessonHit = lessonSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find((hit) => hit._source.type === "lesson"),
);
const unitHit = unitSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find((hit) => hit._source.type === "unit"),
);

const unitHitTier = unitSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find(
    (hit) => hit._source.slug === "macbeth-narrative-writing-core",
  ),
);
const lessonHitTier = lessonSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find(
    (hit) =>
      hit._source.slug === "to-analyse-the-opening-of-the-play-macbeth-c9h3cd",
  ),
);

const allKeyStages = searchPageFixture().keyStages;

describe("search helpers", () => {
  test("getLessonObject maps to new key stage slug", () => {
    const lessonListObject = getLessonObject({
      hit: lessonHit,
      allKeyStages,
    });

    expect(lessonListObject?.keyStageSlug).toEqual("ks2");
  });

  test("getUnitObject maps to new key stage slug", () => {
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });

    expect(unitListObject?.keyStageSlug).toEqual("ks2");
  });

  test("getProgrammeSlug returns a correct slug", () => {
    const unitListObjectLegacy = getUnitObject({
      hit: { ...unitHit, legacy: true },
      allKeyStages,
    });
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });
    const lessonListObject = getLessonObject({ hit: lessonHit, allKeyStages });
    const lessonListObjectLegacy = getLessonObject({
      hit: { ...lessonHit, legacy: true },
      allKeyStages,
    });
    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-primary-ks2",
    );
    expect(unitListObjectLegacy?.buttonLinkProps.programmeSlug).toEqual(
      "english-primary-ks2-l",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "drama-primary-ks2",
    );
    expect(lessonListObjectLegacy?.buttonLinkProps.programmeSlug).toEqual(
      "drama-primary-ks2-l",
    );
  });
  test("getProgrammeSlug returns a correct slug with tier", () => {
    const unitListObject = getUnitObject({ hit: unitHitTier, allKeyStages });
    const lessonListObject = getLessonObject({
      hit: lessonHitTier,
      allKeyStages,
    });
    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-core",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-secondary-ks4-higher",
    );
  });
  test("legacy suffix is only added when legacy flag is true ", () => {
    const unitListObject = getUnitObject({
      hit: { ...unitHit, legacy: true },
      allKeyStages,
    });
    const lessonListObject = getLessonObject({
      hit: { ...lessonHit, legacy: true },
      allKeyStages,
    });
    expect(unitListObject?.buttonLinkProps.programmeSlug).toEqual(
      "english-primary-ks2-l",
    );
    expect(lessonListObject?.buttonLinkProps.programmeSlug).toEqual(
      "drama-primary-ks2-l",
    );
  });
  test("isFilterItem returns true if slug is a filter item", () => {
    expect(isFilterItem("ks2", allKeyStages)).toEqual(true);
  });
  test("isFilterItem returns false if slug is not filter item", () => {
    expect(isFilterItem("hello", allKeyStages)).toEqual(false);
  });
  test("getFilterForQuery return array from array", () => {
    expect(getFilterForQuery(["ks3", "ks2"], allKeyStages)).toEqual([
      "ks3",
      "ks2",
    ]);
  });
  test("getFilterForQuery return array from string", () => {
    expect(getFilterForQuery("ks2", allKeyStages)).toEqual(["ks2"]);
  });

  test("gets expected filters from query", () => {
    const query = {
      term: "macbeth",
      keyStages: "ks2",
      subjects: "english-grammar",
      contentTypes: "lesson",
      examBoards: "wjec",
    } as ParsedUrlQuery;

    const result = getFiltersFromQuery(query);
    expect(result).toEqual(["ks2", "lesson", "wjec", "english-grammar"]);
  });
  test("gets expected filters from query with empty filters", () => {
    const query = { term: "macbeth" };
    const result = getFiltersFromQuery(query);
    expect(result).toEqual([]);
  });
  test("gets sorted filters with multiple filters", () => {
    const query = {
      term: "macbeth",
      keyStages: "ks2",
      subjects: "english-grammar",
      contentTypes: "lesson",
      examBoards: "wjec",
    } as ParsedUrlQuery;

    const result = getSortedSearchFiltersSelected(query);
    expect(result).toEqual(["english-grammar", "ks2", "lesson", "wjec"]);
  });
});
