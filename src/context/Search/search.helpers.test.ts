import searchPageFixture from "../../node-lib/curriculum-api/fixtures/searchPage.fixture";

import {
  getFilterForQuery,
  getLessonObject,
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
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });
    const lessonListObject = getLessonObject({ hit: lessonHit, allKeyStages });
    expect(unitListObject?.programmeSlug).toEqual("english-primary-ks2");
    expect(lessonListObject?.programmeSlug).toEqual("drama-primary-ks2");
  });
  test("getProgrammeSlug returns a correct slug with tier", () => {
    const unitListObject = getUnitObject({ hit: unitHitTier, allKeyStages });
    const lessonListObject = getLessonObject({
      hit: lessonHitTier,
      allKeyStages,
    });
    expect(unitListObject?.programmeSlug).toEqual("english-secondary-ks4-core");
    expect(lessonListObject?.programmeSlug).toEqual(
      "english-secondary-ks4-higher",
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
});
