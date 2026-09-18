"use client";
import { useMemo } from "react";

import { useTeacherBrowseAnalytics } from "../TeacherBrowseAnalyticsProvider";
import { ProgrammeState } from "../teacherBrowseAnalytics.types";

import { resolveOakHref } from "@/common-lib/urls";

export type DerivedProgrammeState = {
  programmeState: ProgrammeState | null;
  browseLevel: ProgrammeState["browseLevel"] | undefined;
  programmeSlug: string | undefined;
  unitSlug: string | undefined;
  lessonSlug: string | undefined;
  unitHref: string | undefined;
  lessonHref: string | undefined;
};

export const deriveProgrammeState = (
  programmeState: ProgrammeState | null,
): DerivedProgrammeState => {
  const programmeSlug = programmeState?.programmeSlug;
  const unitSlug =
    programmeState && programmeState.browseLevel !== "programme"
      ? programmeState.unit.slug
      : undefined;
  const lessonSlug =
    programmeState?.browseLevel === "lesson"
      ? programmeState.lesson.slug
      : undefined;

  return {
    programmeState,
    browseLevel: programmeState?.browseLevel,
    programmeSlug,
    unitSlug,
    lessonSlug,
    unitHref:
      programmeSlug && unitSlug
        ? resolveOakHref({ page: "unit-overview", programmeSlug, unitSlug })
        : undefined,
    lessonHref:
      programmeSlug && unitSlug && lessonSlug
        ? resolveOakHref({
            page: "lesson-overview",
            programmeSlug,
            unitSlug,
            lessonSlug,
          })
        : undefined,
  };
};

/**
 * Reads the current browse journey's programme state from the Teacher Browse
 * store and exposes the commonly derived slugs and hrefs alongside it.
 */
export const useProgrammeState = (): DerivedProgrammeState => {
  const programmeState = useTeacherBrowseAnalytics(
    (store) => store.programmeState,
  );

  return useMemo(() => deriveProgrammeState(programmeState), [programmeState]);
};
