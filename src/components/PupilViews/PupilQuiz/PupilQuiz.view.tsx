import {
  OakBackLink,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
  OakQuizCounter,
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

type QuizSection = "starter-quiz" | "exit-quiz";

const isQuizSection = (section: string): section is QuizSection => {
  return ["starter-quiz", "exit-quiz"].includes(section);
};

const QuizInner = () => {
  const { currentSection, updateCurrentSection } = useLessonEngineContext();
  const quizEngineContext = useQuizEngineContext();

  if (!isQuizSection(currentSection)) {
    return null;
  }

  const {
    currentQuestionIndex,
    questionState,
    handleNextQuestion,
    numQuestions,
  } = quizEngineContext;

  const isFeedbackMode =
    questionState[currentQuestionIndex]?.mode === "feedback";
  const formId = "quiz-form";

  const bottomNavSlot = (
    <OakLessonBottomNav
      feedback={
        isFeedbackMode
          ? questionState[currentQuestionIndex]?.grade === 1
            ? "correct"
            : "incorrect"
          : null
      }
    >
      {!isFeedbackMode && (
        <OakPrimaryButton
          form={formId}
          disabled={questionState[currentQuestionIndex]?.mode === "init"}
          type="submit"
          width={["100%", "auto"]}
        >
          Submit
        </OakPrimaryButton>
      )}
      {isFeedbackMode && (
        <OakPrimaryButton width={["100%", "auto"]} onClick={handleNextQuestion}>
          {currentQuestionIndex + 1 === numQuestions
            ? "Continue lesson"
            : "Next question"}
        </OakPrimaryButton>
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
      counterSlot={
        <OakQuizCounter
          counter={currentQuestionIndex + 1}
          total={numQuestions}
        />
      }
      heading={currentSection === "starter-quiz" ? "Starter Quiz" : "Exit Quiz"}
      lessonSectionName={currentSection}
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
