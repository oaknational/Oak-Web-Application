import { syntheticUnitvariantsWithLessonIdsFixture } from "@oaknational/oak-curriculum-schema";

import { applyGenericOverridesAndExceptions } from "./overridesAndExceptions";

describe("applyOverridesAndExceptions", () => {
  it("should return the original curriculum if there are no overrides or exceptions", () => {
    const browseData = syntheticUnitvariantsWithLessonIdsFixture({});
    expect(
      applyGenericOverridesAndExceptions({
        journey: "pupil",
        queryName: "pupilUnitListingQuery",
        browseData,
      })[0],
    ).toEqual(browseData);
  });

  it("should exclude items if the exclusion field matches the query name", () => {
    const browseData = syntheticUnitvariantsWithLessonIdsFixture({
      overrides: { actions: { exclusions: ["pupilUnitListingQuery"] } },
    });
    expect(
      applyGenericOverridesAndExceptions({
        journey: "teacher",
        queryName: "pupilUnitListingQuery",
        browseData,
      }),
    ).toEqual([]);
  });

  it("should exclude items if the exclusion field matches the journey name", () => {
    const browseData = syntheticUnitvariantsWithLessonIdsFixture({
      overrides: { actions: { exclusions: ["teacher"] } },
    });
    expect(
      applyGenericOverridesAndExceptions({
        journey: "teacher",
        queryName: "pupilUnitListingQuery",
        browseData,
      }),
    ).toEqual([]);
  });

  it("should apply programme field overrides", () => {
    const browseData = syntheticUnitvariantsWithLessonIdsFixture({
      overrides: {
        actions: {
          programme_field_overrides: {
            subject: "Art and design",
          },
        },
      },
    });
    expect(
      applyGenericOverridesAndExceptions({
        journey: "pupil",
        queryName: "pupilUnitListingQuery",
        browseData,
      })[0]?.programme_fields?.subject,
    ).toEqual("Art and design");
  });

  it("should not apply programme field overrides if the journey is opted out", () => {
    const browseData = syntheticUnitvariantsWithLessonIdsFixture({
      overrides: {
        actions: {
          programme_field_overrides: {
            subject: "Art and design",
          },
          opt_out: ["pupil"],
        },
      },
    });
    expect(
      applyGenericOverridesAndExceptions({
        journey: "pupil",
        queryName: "pupilUnitListingQuery",
        browseData,
      })[0]?.programme_fields?.subject,
    ).not.toEqual("Art and design");
  });
});
