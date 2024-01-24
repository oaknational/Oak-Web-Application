import { FC } from "react";

import { LessonOverview } from "@/components/TeacherViews/LessonOverview.view";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

type SpecialistLessonProps = {
  curriculumData: SpecialistLessonOverviewData;
};

export type SpecialistLessonOverviewData = Omit<
  LessonOverviewPageData,
  "keyStageSlug" | "keyStageTitle"
>;

const SpecialistLesson: FC<SpecialistLessonProps> = ({ curriculumData }) => {
  return (
    <>
      <LessonOverview lesson={{ ...curriculumData, isCanonical: false }} />
    </>
  );
};

export default SpecialistLesson;
