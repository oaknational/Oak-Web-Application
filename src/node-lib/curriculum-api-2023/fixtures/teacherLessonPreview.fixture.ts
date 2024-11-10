import lessonOverviewFixture from "./lessonOverview.fixture";

import { TeacherPreviewLessonPageProps } from "@/pages/teachers/beta/lessons/[lessonSlug]";

const teacherLessonPreviewFixture = (
  partial?: Partial<TeacherPreviewLessonPageProps>,
) => {
  return {
    ...lessonOverviewFixture(),
    ...partial,
  };
};

export default teacherLessonPreviewFixture;
