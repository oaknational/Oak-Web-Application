import {
  getProgrammeStateForLesson,
  getProgrammeStateForUnit,
} from "../utils/getProgrammeState";
import { ProgrammeState } from "../teacherBrowseAnalytics.types";

import { deriveProgrammeState, useProgrammeState } from "./useProgrammeState";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import {
  allProviders,
  renderHookWithProviders,
} from "@/__tests__/__helpers__/renderWithProviders";

const renderUseProgrammeState = (programmeState: ProgrammeState) =>
  renderHookWithProviders({
    ...allProviders,
    teacherBrowseAnalytics: { programmeState },
  })(() => useProgrammeState()).result.current;

describe("deriveProgrammeState", () => {
  it("returns no slugs or hrefs when there is no programme state", () => {
    expect(deriveProgrammeState(null)).toEqual({
      programmeState: null,
      browseLevel: undefined,
      programmeSlug: undefined,
      unitSlug: undefined,
      lessonSlug: undefined,
      unitHref: undefined,
      lessonHref: undefined,
    });
  });

  it("derives the unit href at unit browse level", () => {
    const derived = deriveProgrammeState(
      getProgrammeStateForUnit(teachersUnitOverviewFixture()),
    );

    expect(derived.unitSlug).toBe("cells");
    expect(derived.unitHref).toBe(
      "/teachers/programmes/biology-secondary-ks3/units/cells/lessons",
    );
    expect(derived.lessonHref).toBeUndefined();
  });

  it("derives the lesson href at lesson browse level", () => {
    const derived = deriveProgrammeState(
      getProgrammeStateForLesson(teachersLessonOverviewFixture()),
    );

    expect(derived.lessonSlug).toBe("lesson-3-structure-of-cells");
    expect(derived.lessonHref).toBe(
      "/teachers/programmes/biology-secondary-ks3/units/cells/lessons/lesson-3-structure-of-cells",
    );
  });
});

describe("useProgrammeState", () => {
  it("reads the programme state from the teacher browse store", () => {
    const programmeState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );

    expect(renderUseProgrammeState(programmeState)).toEqual(
      deriveProgrammeState(programmeState),
    );
  });
});
