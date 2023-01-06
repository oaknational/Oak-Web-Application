import { TeachersLessonOverviewData } from "..";

const teachersLessonOverviewFixture = (
  partial?: Partial<TeachersLessonOverviewData>
): TeachersLessonOverviewData => {
  return {
    slug: "macbeth-lesson-1",
    title: "Islamic Geometry",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    coreContent: ["Lesson", "core", "content"],
    equipmentRequired: null,
    supervisionLevel: null,
    contentGuidance: null,
    presentationUrl: null,
    worksheetUrl: null,
    hasCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    ...partial,
  };
};

export default teachersLessonOverviewFixture;
