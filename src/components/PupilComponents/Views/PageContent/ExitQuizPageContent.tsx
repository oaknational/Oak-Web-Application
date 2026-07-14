import { QuizPageContent } from "@/pages-helpers/pupil/lessons-pages/new/QuizPageContent";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

/**
 * Exit quiz page shared by the canonical, browse and preview pupil lesson
 * routes.
 */
const ExitQuizPageContent = (props: PupilLessonPageProps) => {
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
        section="exit-quiz"
        questionsArray={lessonContent.exitQuiz}
        lessonSlug={browseData.lessonSlug}
        phase={browseData.programmeFields.phase as "primary" | "secondary"}
      />
    </PupilLayout>
  );
};

export default ExitQuizPageContent;
