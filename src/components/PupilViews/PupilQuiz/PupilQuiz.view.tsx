import {
  OakBackLink,
  OakBox,
  OakFlex,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonLayoutProps,
  OakLessonTopNav,
  OakPrimaryButton,
} from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsQuiz = () => {
  const { currentSection, updateCurrentSection } = useLessonEngineContext();
  const quizEngineContext = useQuizEngineContext();

  const { currentQuestionIndex, questionState, handleNextQuestion } =
    quizEngineContext;

  const isFeedbackMode =
    questionState[currentQuestionIndex]?.mode === "feedback";

  return (
    <OakBox>
      <OakLessonLayout
        bottomNavSlot={
          <OakLessonBottomNav>
            {!isFeedbackMode && (
              <OakFlex $pt="inner-padding-l">
                <OakPrimaryButton
                  form={"a-form"}
                  disabled={
                    questionState[currentQuestionIndex]?.mode === "init"
                  }
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
                //{" "}
              </OakFlex>
            )}
          </OakLessonBottomNav>
        }
        lessonSectionName={
          currentSection as OakLessonLayoutProps["lessonSectionName"]
        }
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
            heading="Intro"
            lessonSectionName="intro"
            mobileSummary="In progress..."
          />
        }
      >
        <OakFlex>
          <QuizRenderer />
        </OakFlex>
      </OakLessonLayout>
    </OakBox>
  );
};
