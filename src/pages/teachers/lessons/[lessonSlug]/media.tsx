import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonDownloadsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloadsCanonical.schema";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";

export type LessonMediaCanonicalPageProps = {
  curriculumData: LessonDownloadsCanonical;
};

const LessonMediaCanonicalPage = () => {
  const lessonTitle = "Geometry";
  const lessonSlug = "basics-of-geometry";
  const subjectTitle = "Maths";
  const subjectSlug = "maths";
  const programmeSlug = "maths";
  const unitSlug = "geometry";
  const unitTitle = "Geometry";

  const lesson = {
    lessonTitle,
    lessonSlug,
    subjectTitle,
    subjectSlug,
    unitTitle,
    unitSlug,
    programmeSlug,
    pathways: [
      {
        subjectTitle,
        subjectSlug,
        unitTitle,
        unitSlug,
        programmeSlug,
      },
    ],
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Share: ${lessonTitle}`,
          description:
            "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
        }),
      }}
    >
      <LessonMedia isCanonical lesson={lesson} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

export default LessonMediaCanonicalPage;
