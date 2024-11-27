import { LessonMediaClipsData } from "../queries/lessonMediaClips/lessonMediaClips.schema";

const lessonMediaClipsFixtures = (
  partial?: Partial<LessonMediaClipsData>,
): LessonMediaClipsData => {
  return {
    programmeSlug: "physical-education-ks4",
    lessonSlug: "running-and-jumping",
    lessonTitle: "Running and jumping",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    unitSlug: "running-and-jumping",
    unitTitle: "Running and jumping",
    subjectSlug: "physical-education",
    subjectTitle: "Physical Education",
    examBoardSlug: null,
    examBoardTitle: null,
    tierSlug: null,
    tierTitle: null,
    ...partial,
  };
};

export default lessonMediaClipsFixtures;
