import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { populateLessonWithTranscript } from "@/utils/handleTranscript";
import { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: { lessonSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lessonSlug = (await params).lessonSlug;

  // fetch data
  const lesson = await curriculumApi2023.lessonOverview({ lessonSlug });

  return {
    title: `Lesson: ${lesson.lessonTitle}`,
    description: "Overview of lesson",
    alternates: {
      canonical: `${getBrowserConfig("seoAppUrl")}/teachers/lessons/${lesson.lessonSlug}`,
    },
  };
}

async function LessonPage({
  params: { lessonSlug },
}: {
  params: { lessonSlug: string };
}) {
  const result = await curriculumApi2023.lessonOverview({ lessonSlug });
  const lesson = await populateLessonWithTranscript(result);

  return (
    <AppLayout seoProps={{ title: "", description: "" }}>
      <LessonOverview
        lesson={{
          ...lesson,
          isCanonical: true,
          isSpecialist: false,
        }}
        isBeta={false}
      />
    </AppLayout>
  );
}

export default LessonPage;
