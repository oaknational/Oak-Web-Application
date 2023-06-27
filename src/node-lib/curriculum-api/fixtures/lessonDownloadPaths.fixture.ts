import { LessonDownloadPaths } from "..";

const lessonDownloadPathsFixture = (
  partial?: Partial<LessonDownloadPaths>
): LessonDownloadPaths => {
  return {
    downloads: [
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

export default lessonDownloadPathsFixture;
