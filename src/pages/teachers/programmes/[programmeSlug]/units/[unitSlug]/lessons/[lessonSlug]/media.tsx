import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const LessonMediaPage = () => {
  const lessonTitle = "Geometry";
  const lessonSlug = "basics-of-geometry";
  const keyStageSlug = "ks3";
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
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            programmeSlug
          }/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
      }}
    >
      <LessonMedia isCanonical={false} lesson={lesson} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

export default LessonMediaPage;
