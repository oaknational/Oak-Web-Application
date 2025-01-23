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

    const result = constructSubjectsFromUnitData(units);
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
      },
    ]);
  });
});
