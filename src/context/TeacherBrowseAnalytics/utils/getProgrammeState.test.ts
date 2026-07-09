import {
  getProgrammeStateForLesson,
  getProgrammeStateForUnit,
} from "./getProgrammeState";

import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

describe("getProgrammeState", () => {
  it("getProgrammeStateForUnit returns data in the correct shape", () => {
    const result = getProgrammeStateForUnit(teachersUnitOverviewFixture());
    expect(result).toEqual({
      browseLevel: "unit",
      examBoardSlug: null,
      examBoardTitle: null,
      keyStageSlug: "ks3",
      keyStageTitle: "Key Stage 3",
      pathwaySlug: null,
      pathwayTitle: null,
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      tierSlug: null,
      tierTitle: null,
      unit: {
        slug: "cells",
        title: "Cells",
      },
      year: "7",
      yearGroupTitle: "Year 7",
    });
  });
  it("getProgrammeStateForUnit returns data in the correct shape for units with programme factors", () => {
    const result = getProgrammeStateForUnit(
      teachersUnitOverviewFixture({
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        tierSlug: "core",
        tierTitle: "Core",
      }),
    );
    expect(result).toEqual({
      browseLevel: "unit",
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      keyStageSlug: "ks3",
      keyStageTitle: "Key Stage 3",
      pathwaySlug: null,
      pathwayTitle: null,
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      tierSlug: "core",
      tierTitle: "Core",
      unit: {
        slug: "cells",
        title: "Cells",
      },
      year: "7",
      yearGroupTitle: "Year 7",
    });
  });
  it("getProgrammeStateForLesson returns data in the correct shape", () => {
    const result = getProgrammeStateForLesson(
      teachersLessonOverviewFixture({
        pathwaySlug: "core",
        pathwayTitle: "Core",
      }),
    );
    expect(result).toEqual({
      browseLevel: "lesson",
      examBoardSlug: null,
      examBoardTitle: null,
      keyStageSlug: "ks3",
      keyStageTitle: "Key Stage 3",
      lesson: {
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        slug: "lesson-3-structure-of-cells",
        title: "Structure of cells",
      },
      pathwaySlug: "core",
      pathwayTitle: "Core",
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      tierSlug: undefined,
      tierTitle: undefined,
      unit: {
        slug: "cells",
        title: "Cells",
      },
      year: "7",
      yearGroupTitle: "Year 7",
    });
  });
});
