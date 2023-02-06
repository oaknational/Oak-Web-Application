import { TeachersLessonOverviewPaths } from "..";

const teachersLessonOverviewPathsFixture = (
  partial?: Partial<TeachersLessonOverviewPaths>
): TeachersLessonOverviewPaths => {
  return {
    lessons: [
      {
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        unitSlug: "geometry",
        lessonSlug: "cirlces-001",
      },
      {
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        unitSlug: "geometry",
        lessonSlug: "squares-002",
      },
      {
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        unitSlug: "geometry",
        lessonSlug: "triangles-003",
      },
      {
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        unitSlug: "geometry",
        lessonSlug: "oblongs-004",
      },
    ],
    ...partial,
  };
};

export default teachersLessonOverviewPathsFixture;
