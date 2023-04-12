import searchPageFixture from "../../node-lib/curriculum-api/fixtures/searchPage.fixture";

import {
  getLessonObject,
  getUnitObject,
  lessonSearchHitSchema,
  unitSearchHitSchema,
} from "./helpers";
import elasticResponseFixture from "./elasticResponse.fixture.json";

const lessonHit = lessonSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find((hit) => hit._source.type === "lesson")
);
const unitHit = unitSearchHitSchema.parse(
  elasticResponseFixture.hits.hits.find((hit) => hit._source.type === "unit")
);

const allKeyStages = searchPageFixture().keyStages;

describe("search helpers", () => {
  test("getLessonObject maps to new key stage slug", () => {
    const lessonListObject = getLessonObject({
      hit: lessonHit,
      allKeyStages,
    });

    expect(lessonListObject.keyStageSlug).toEqual("ks2");
  });

  test("getUnitObject maps to new key stage slug", () => {
    const unitListObject = getUnitObject({ hit: unitHit, allKeyStages });

    expect(unitListObject.keyStageSlug).toEqual("ks2");
  });
});
