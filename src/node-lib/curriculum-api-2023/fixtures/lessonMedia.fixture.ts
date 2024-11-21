import { LessonMediaData } from "../queries/lessonMedia/lessonMedia.schema";

const lessonShareFixtures = (
  partial?: Partial<LessonMediaData>,
): LessonMediaData => {
  return {
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4-l",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    ...partial,
  };
};

export default lessonShareFixtures;
