import { QuizPageContent } from "@/pages-helpers/pupil/lessons-pages/new/QuizPageContent";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

/**
 * Starter quiz page shared by the canonical, browse and preview pupil lesson
 * routes.
 */
const StarterQuizPageContent = (props: PupilLessonPageProps) => {
  const { browseData, lessonContent, variant } = props;

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({
          title: browseData.lessonData.title,
          description: browseData.lessonData.pupilLessonOutcome,
        }),
        noIndex: true,
      }}
      pupilStores={{ browseData, lessonContent, variant }}
    >
      <QuizPageContent
        section="starter-quiz"
        questionsArray={lessonContent.starterQuiz}
        lessonSlug={browseData.lessonSlug}
        phase={browseData.programmeFields.phase as "primary" | "secondary"}
      />
    </PupilLayout>
  );
};

export default StarterQuizPageContent;
