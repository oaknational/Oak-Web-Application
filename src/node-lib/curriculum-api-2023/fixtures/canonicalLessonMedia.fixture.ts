import { CanonicalLessonMediaData } from "../queries/canonicalLessonMedia/canonicalLessonMedia.schema";

const canonicalLessonMediaFixture = (
  partial?: Partial<CanonicalLessonMediaData>,
): CanonicalLessonMediaData => ({
  lessonTitle: "Running as a team",
  subjectSlug: "physical-education",
  pathways: [
    {
      programmeSlug: "physical-education-ks4",
      unitSlug: "running-and-jumping",
      unitTitle: "Running and jumping",
      keyStageSlug: "ks4",
      subjectSlug: "physical-education",
      subjectTitle: "Physical Education",
      yearGroupTitle: "Year 10",
      examBoardTitle: null,
      tierTitle: null,
      pathwayTitle: null,
    },
  ],
  ...partial,
});

export default canonicalLessonMediaFixture;
