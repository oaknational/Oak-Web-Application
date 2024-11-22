import { LessonMediaClipsData } from "../queries/lessonMediaClips/lessonMediaClips.schema";

const lessonMediaFixture = (
  partial?: Partial<LessonMediaClipsData>,
): LessonMediaClipsData => {
  return {
    lessonSlug: "running-as-a-team",
    lessonTitle: "Running as a team",
    programmeSlug: "physical-education-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "physical-education",
    subjectTitle: "Physical Education",
    unitSlug: "running-and-jumping",
    unitTitle: "Running and jumping",
    ...partial,
  };
};

export default lessonMediaFixture;
