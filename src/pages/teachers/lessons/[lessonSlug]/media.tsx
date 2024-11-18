import { useFeatureFlagEnabled } from "posthog-js/react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";

const LessonMediaCanonicalPage = () => {
  const isMediaPageContentEnabled = useFeatureFlagEnabled(
    "is_media_page_content_enabled",
  );

  if (isMediaPageContentEnabled) {
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
  } else {
    return null;
  }
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

export default LessonMediaCanonicalPage;
