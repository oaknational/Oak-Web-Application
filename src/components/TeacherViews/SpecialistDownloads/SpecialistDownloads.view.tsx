import { FC } from "react";

import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type SpecialistDownloadsView = {
  curriculumData: SpecialistDownloadsProps;
};

type SpecialistDownloadsProps = {
  lesson: LessonPathway & {
    isLegacy: boolean;
    lessonTitle: string;
    lessonSlug: string;
    downloads: LessonDownloadsData["downloads"];
    nextLessons: NextLesson[];
  };
};

const SpecialistDownloads: FC<SpecialistDownloadsView> = ({
  curriculumData,
}) => {
  return (
    <>
      <LessonDownloads isCanonical={false} lesson={curriculumData.lesson} />
    </>
  );
};

export default SpecialistDownloads;
