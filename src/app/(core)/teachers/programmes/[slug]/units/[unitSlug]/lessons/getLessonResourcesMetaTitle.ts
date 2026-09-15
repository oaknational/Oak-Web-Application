// Shared title format for the unit and lesson pages, e.g.
// "Cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources"
export const getLessonResourcesMetaTitle = ({
  contentTitle,
  keyStageSlug,
  year,
  subjectTitle,
  tierTitle,
  examBoardTitle,
  pathwayTitle,
}: {
  contentTitle: string;
  keyStageSlug: string;
  year: string;
  subjectTitle: string;
  tierTitle?: string | null;
  examBoardTitle?: string | null;
  pathwayTitle?: string | null;
}) => {
  const tierSegment = tierTitle ? ` ${tierTitle}` : "";
  const examboardSegment = examBoardTitle ? ` ${examBoardTitle}` : "";
  const gcseSegment = pathwayTitle === "GCSE" || !!tierSegment ? "GCSE | " : "";

  return `${contentTitle} ${gcseSegment}${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle}${tierSegment}${examboardSegment} | Lesson Resources`;
};
