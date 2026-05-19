import { LessonOverviewSectionProgress } from "../lessonOverviewSections";

type GetSectionProgressArgs = {
  isComplete?: boolean;
  hasProgress?: boolean;
};

export const getSectionProgress = ({
  isComplete,
  hasProgress,
}: GetSectionProgressArgs): LessonOverviewSectionProgress => {
  if (isComplete) {
    return "complete";
  }

  if (hasProgress) {
    return "in-progress";
  }

  return "not-started";
};
