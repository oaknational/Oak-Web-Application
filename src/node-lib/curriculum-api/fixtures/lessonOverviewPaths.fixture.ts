import { LessonOverviewPaths } from "..";

const lessonOverviewPathsFixture = (
  partial?: Partial<LessonOverviewPaths>
): LessonOverviewPaths => {
  return {
    lessons: [
      {
        programmeSlug: "maths-higher-ks4",
        unitSlug: "geometry",
        lessonSlug: "cirlces-001",
      },
      {
        programmeSlug: "maths-higher-ks4",
        unitSlug: "geometry",
        lessonSlug: "squares-002",
      },
      {
        programmeSlug: "maths-higher-ks4",
        unitSlug: "geometry",
        lessonSlug: "triangles-003",
      },
      {
        programmeSlug: "maths-higher-ks4",
        unitSlug: "geometry",
        lessonSlug: "oblongs-004",
      },
    ],
    ...partial,
  };
};

export default lessonOverviewPathsFixture;
