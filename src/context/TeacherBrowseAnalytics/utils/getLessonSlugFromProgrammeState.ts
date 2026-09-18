import { ProgrammeState } from "../teacherBrowseAnalytics.types";

export const getLessonSlugFromProgrammeState = (
  programmeState: ProgrammeState | null | undefined,
): string | undefined => {
  return programmeState?.browseLevel === "lesson"
    ? programmeState.lesson.slug
    : undefined;
};
