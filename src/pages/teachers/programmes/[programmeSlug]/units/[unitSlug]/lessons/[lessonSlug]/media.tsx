import { useFeatureFlagEnabled } from "posthog-js/react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const LessonMediaPage = () => {
  const isMediaPageContentEnabled = useFeatureFlagEnabled(
    "is_media_page_content_enabled",
  );

  if (isMediaPageContentEnabled) {
    // hardcode data until we have gql query for media page
    const lessonTitle = "Add 3 numbers together using doubles and near doubles";
    const lessonSlug = "add-3-numbers-together-using-doubles-and-near-doubles";
    const keyStageSlug = "ks3";
    const subjectTitle = "Maths";
    const subjectSlug = "maths";
    const programmeSlug = "maths-primary-ks2";
    const unitSlug = "review-strategies-for-adding-and-subtracting-across-10";
    const unitTitle = "Review strategies for adding and subtracting across 10";

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
  } else {
    return null;
  }
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

export default LessonMediaPage;
