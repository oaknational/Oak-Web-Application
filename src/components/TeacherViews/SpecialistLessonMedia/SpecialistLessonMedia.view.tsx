import { FC } from "react";

import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import { SpecialistLessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";

const SpecialistLessonMedia: FC<SpecialistLessonDownloadsPageData> = ({
  curriculumData,
}) => {
  return <LessonMedia isCanonical={false} lesson={curriculumData.lesson} />;
};

export default SpecialistLessonMedia;
