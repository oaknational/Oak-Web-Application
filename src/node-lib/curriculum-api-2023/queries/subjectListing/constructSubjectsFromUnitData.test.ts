import {
  SyntheticUnitvariantsWithLessonIdsByKs,
  syntheticUnitvariantsWithLessonIdsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import { constructSubjectsFromUnitData } from "./constructSubjectsFromUnitData";

describe("constructSubjectsFromUnitData", () => {
  it("should construct subject objects from unit data correctly", () => {
    const units: SyntheticUnitvariantsWithLessonIdsByKs[] = [
      syntheticUnitvariantsWithLessonIdsByKsFixture({}),
    ];

    const result = constructSubjectsFromUnitData(units, []);
    expect(result).toEqual([
      {
        subjectTitle: "Maths",
        subjectSlug: "maths",
        programmeSlug: "programme-slug",
        unitCount: 1,
        lessonCount: 1,
        programmeCount: 1,
        pathwaySlug: null,
        pathwayTitle: null,
        actions: {},
        features: {},
      },
    ]);
  });

  it("should construct subject objects from unit data correctly with features", () => {
    const units: SyntheticUnitvariantsWithLessonIdsByKs[] = [
      syntheticUnitvariantsWithLessonIdsByKsFixture({}),
    ];

    const mathsFeatures = { featureFlag: true };

    const result = constructSubjectsFromUnitData(units, [
      { slug: "maths", features: mathsFeatures },
    ]);

    expect(result).toEqual([
      {
        subjectTitle: "Maths",
        subjectSlug: "maths",
        programmeSlug: "programme-slug",
        unitCount: 1,
        lessonCount: 1,
        programmeCount: 1,
        pathwaySlug: null,
        pathwayTitle: null,
        actions: {},
        features: mathsFeatures,
      },
    ]);
  });
});
