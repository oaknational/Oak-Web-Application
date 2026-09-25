import {
  getProgrammeStateForLesson,
  getProgrammeStateForProgramme,
  getProgrammeStateForUnit,
} from "../utils/getProgrammeState";
import { ProgrammeState } from "../teacherBrowseAnalytics.types";

import { useProgrammeState } from "./useProgrammeState";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import {
  allProviders,
  renderHookWithProviders,
} from "@/__tests__/__helpers__/renderWithProviders";

const renderUseProgrammeState = (programmeState: ProgrammeState | null) =>
  renderHookWithProviders({
    ...allProviders,
    teacherBrowseAnalytics: { programmeState },
  })(() => useProgrammeState()).result.current;

describe("useProgrammeState", () => {
  it("returns empty state when there is no programme state", () => {
    expect(renderUseProgrammeState(null)).toEqual({
      currentHref: null,
      lessonState: null,
      unitState: null,
    });
  });

  it("returns the programme state and programme href at programme level", () => {
    const programmeState = getProgrammeStateForProgramme({
      programmeSlug: "biology-secondary-ks3",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
    });

    expect(renderUseProgrammeState(programmeState)).toEqual({
      currentHref: "/teachers/programmes/biology-secondary-ks3/units",
      lessonState: null,
      unitState: null,
    });
  });

  it("returns the unit state and unit href at unit level", () => {
    const programmeState = getProgrammeStateForUnit(
      teachersUnitOverviewFixture(),
    );

    expect(renderUseProgrammeState(programmeState)).toEqual({
      currentHref:
        "/teachers/programmes/biology-secondary-ks3/units/cells/lessons",
      lessonState: null,
      unitState: programmeState,
    });
  });

  it("returns the lesson and unit state and lesson href at lesson level", () => {
    const programmeState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );

    expect(renderUseProgrammeState(programmeState)).toEqual({
      currentHref:
        "/teachers/programmes/biology-secondary-ks3/units/cells/lessons/lesson-3-structure-of-cells",
      lessonState: programmeState,
      unitState: programmeState,
    });
  });
});
