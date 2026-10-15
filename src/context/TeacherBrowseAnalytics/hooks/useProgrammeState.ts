"use client";
import { useMemo } from "react";

import { useTeacherBrowseAnalytics } from "../TeacherBrowseAnalyticsProvider";
import {
  ProgrammeState,
  ProgrammeStateLesson,
  ProgrammeStateUnit,
} from "../teacherBrowseAnalytics.types";

import { resolveOakHref } from "@/common-lib/urls";

export type DerivedProgrammeState = {
  lessonState: ProgrammeStateLesson | null;
  unitState: ProgrammeStateUnit | null;
  currentHref: string | null;
};

const getCurrentHref = (programmeState: ProgrammeState | null) => {
  if (!programmeState) {
    return null;
  }
  switch (programmeState.browseLevel) {
    case "programme":
      return resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: programmeState.programmeSlug,
        tab: "units",
      });
    case "unit":
      return resolveOakHref({
        page: "unit-overview",
        programmeSlug: programmeState.programmeSlug,
        unitSlug: programmeState.unit.slug,
      });
    case "lesson":
      return resolveOakHref({
        page: "lesson-overview",
        programmeSlug: programmeState.programmeSlug,
        unitSlug: programmeState.unit.slug,
        lessonSlug: programmeState.lesson.slug,
      });
  }
};

/**
 * Reads the current browse journey's programme state from the Teacher Browse
 * store and exposes the current state and href.
 */
export const useProgrammeState = (): DerivedProgrammeState => {
  const programmeState = useTeacherBrowseAnalytics(
    (store) => store.programmeState,
  );

  const lessonState =
    programmeState?.browseLevel === "lesson" ? programmeState : null;
  const unitState =
    programmeState?.browseLevel !== "programme" ? programmeState : null;

  const currentHref = useMemo(
    () => getCurrentHref(programmeState),
    [programmeState],
  );

  return { currentHref, lessonState, unitState };
};
