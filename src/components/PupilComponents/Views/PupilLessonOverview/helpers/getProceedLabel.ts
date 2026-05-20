type GetProceedLabelArgs = {
  isLessonComplete: boolean;
  lessonStarted: boolean;
  introIsComplete: boolean;
};

export const getProceedLabel = ({
  isLessonComplete,
  lessonStarted,
  introIsComplete,
}: GetProceedLabelArgs) => {
  if (isLessonComplete) {
    return "Lesson review";
  }

  if (lessonStarted) {
    return "Continue lesson";
  }

  if (introIsComplete) {
    return "Start lesson";
  }

  return "Let's get ready";
};
