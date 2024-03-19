import { FC } from "react";

import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import { SpecialistLessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";

const SpecialistLessonDownloads: FC<SpecialistLessonDownloadsPageData> = ({
  curriculumData,
}) => {
  return <LessonDownloads isCanonical={false} lesson={curriculumData.lesson} />;
};

export default SpecialistLessonDownloads;
