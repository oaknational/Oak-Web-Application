import { FC } from "react";

import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import { LessonDownloadsData } from "@/node-lib/curriculum-api";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type SpecialistLessonDownloadsView = {
  curriculumData: SpecialistLessonDownloadsProps;
};

export type SpecialistLessonDownloadsProps = {
  lesson: LessonPathway & {
    isLegacy: boolean;
    lessonTitle: string;
    lessonSlug: string;
    downloads: LessonDownloadsData["downloads"];
    nextLessons: NextLesson[];
    hasDownloadableResources: boolean;
    expired: boolean | null;
  };
};

const SpecialistLessonDownloads: FC<SpecialistLessonDownloadsView> = ({
  curriculumData,
}) => {
  return (
    <>
      <LessonDownloads isCanonical={false} lesson={curriculumData.lesson} />
    </>
  );
};

export default SpecialistLessonDownloads;
