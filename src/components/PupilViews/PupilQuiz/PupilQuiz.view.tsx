import {
  OakBackLink,
  OakFlex,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
} from "@oak-academy/oak-components";

import {
  QuestionsArray,
  QuizEngineProvider,
  useQuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

type PupilViewsQuizProps = {
  questionsArray: QuestionsArray;
};

type CurrentSection = "starter-quiz" | "exit-quiz";

const QuizInner = () => {
  const { currentSection, updateCurrentSection } = useLessonEngineContext();
  const quizEngineContext = useQuizEngineContext();

  const { currentQuestionIndex, questionState, handleNextQuestion } =
    quizEngineContext;

  const isFeedbackMode =
    questionState[currentQuestionIndex]?.mode === "feedback";
  const formId = "quiz-form";

  const bottomNavSlot = (
    <OakLessonBottomNav>
      {!isFeedbackMode && (
        <OakFlex $pt="inner-padding-l">
          <OakPrimaryButton
            form={formId}
            disabled={questionState[currentQuestionIndex]?.mode === "init"}
            type="submit"
          >
            Submit
          </OakPrimaryButton>
        </OakFlex>
      )}
      {isFeedbackMode && (
        <OakFlex $pt="inner-padding-l">
          <OakPrimaryButton onClick={handleNextQuestion}>
            Next Question
          </OakPrimaryButton>
        </OakFlex>
      )}
    </OakLessonBottomNav>
  );

  const topNavSlot = (
    <OakLessonTopNav
      backLinkSlot={
        <OakBackLink
          type="button"
          onClick={() => {
            updateCurrentSection("overview");
          }}
        />
      }
      counterSlot={null}
      heading={currentSection === "starter-quiz" ? "Starter Quiz" : "Exit Quiz"}
      lessonSectionName={currentSection as CurrentSection}
      mobileSummary="In progress..."
    />
  );
  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName={currentSection}
      topNavSlot={topNavSlot}
    >
      <QuizRenderer formId={formId} />
    </OakLessonLayout>
  );
};

export const PupilViewsQuiz = ({ questionsArray }: PupilViewsQuizProps) => {
  return (
    <QuizEngineProvider questionsArray={questionsArray}>
      <QuizInner />
    </QuizEngineProvider>
  );
};
