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

  return (
    <OakLessonLayout
      bottomNavSlot={
        <OakLessonBottomNav>
          {!isFeedbackMode && (
            <OakFlex $pt="inner-padding-l">
              <OakPrimaryButton
                form={"a-form"}
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
      }
      lessonSectionName={currentSection as CurrentSection}
      topNavSlot={
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
          heading={
            (currentSection as CurrentSection) === "starter-quiz"
              ? "Starter Quiz"
              : "Exit Quiz"
          }
          lessonSectionName={currentSection as CurrentSection}
          mobileSummary="In progress..."
        />
      }
    >
      <OakFlex>
        <QuizRenderer />
      </OakFlex>
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
