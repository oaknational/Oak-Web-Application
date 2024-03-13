import { FC } from "react";

import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";

type SpecialistLessonProps = {
  lesson: SpecialistLessonOverviewData;
};

const SpecialistLesson: FC<SpecialistLessonProps> = (props) => {
  return (
    <>
      <LessonOverview lesson={{ ...props.lesson, isCanonical: false }} />
    </>
  );
};

export default SpecialistLesson;
