import {
  OakCloudinaryConfigProvider,
  OakBackLink,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
  OakQuizCounter,
  OakSpan,
} from "@oaknational/oak-components";

import {
  QuestionsArray,
  QuizEngineProvider,
  useQuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { pickFeedBackComponent } from "@/components/PupilComponents/QuizUtils/pickFeedback";

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
    currentQuestionData,
    currentQuestionIndex,
    currentQuestionDisplayIndex,
    questionState,
    handleNextQuestion,
    numQuestions,
    numInteractiveQuestions,
  } = quizEngineContext;

  const formId = "quiz-form";
  const isFeedbackMode =
    questionState[currentQuestionIndex]?.mode === "feedback";
  const isExplanatoryText =
    currentQuestionData?.questionType === "explanatory-text";

  const grade = questionState[currentQuestionIndex]?.grade;
  const isPartiallyCorrect =
    questionState[currentQuestionIndex]?.isPartiallyCorrect;
  const isCorrect = grade === 1;

  const correctFeedback = (
    <OakSpan $color={"text-primary"} $font={"body-2"}>
      Well done!
    </OakSpan>
  );

  const incorrectFeedback = (answers: QuestionsArray[number]["answers"]) => {
    if (answers) {
      return pickFeedBackComponent(answers);
    }
    return null;
  };

  function pickFeedback(isCorrect: boolean, isPartiallyCorrect?: boolean) {
    switch (true) {
      case isCorrect:
        return "correct";
      case !isCorrect && !isPartiallyCorrect:
        return "incorrect";
      case !isCorrect && isPartiallyCorrect:
        return "partially-correct";
      default:
        return null;
    }
  }

  const navigationButtonCopy = (() => {
    if (currentQuestionIndex + 1 !== numQuestions) {
      return "Next question";
    }

    // This is the last question in the quiz, show the appropriate button label
    return currentSection === "exit-quiz" ? "Lesson review" : "Continue lesson";
  })();

  const bottomNavSlot = (
    <OakLessonBottomNav
      feedback={
        isFeedbackMode ? pickFeedback(isCorrect, isPartiallyCorrect) : null
      }
      answerFeedback={
        isCorrect
          ? correctFeedback
          : incorrectFeedback(currentQuestionData?.answers)
      }
    >
      {!isFeedbackMode && !isExplanatoryText && (
        <OakPrimaryButton
          form={formId}
          disabled={questionState[currentQuestionIndex]?.mode === "init"}
          type="submit"
          isTrailingIcon
          iconName="arrow-right"
          width={["100%", "max-content"]}
        >
          Check
        </OakPrimaryButton>
      )}
      {(isFeedbackMode || isExplanatoryText) && (
        <OakPrimaryButton
          width={["100%", "max-content"]}
          onClick={handleNextQuestion}
          isTrailingIcon
          iconName="arrow-right"
        >
          {navigationButtonCopy}
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
        !isExplanatoryText && (
          <OakQuizCounter
            counter={currentQuestionDisplayIndex + 1}
            total={numInteractiveQuestions}
          />
        )
      }
      heading={currentSection === "starter-quiz" ? "Starter Quiz" : "Exit Quiz"}
      lessonSectionName={currentSection}
      mobileSummary={
        !isExplanatoryText && (
          <OakSpan $color={"text-primary"} $font={"body-3"}>
            Question {currentQuestionDisplayIndex + 1} of{" "}
            {numInteractiveQuestions}
          </OakSpan>
        )
      }
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
    <OakCloudinaryConfigProvider
      value={{
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        },
        url: {
          secureDistribution:
            process.env.NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION,
          privateCdn: true,
        },
      }}
    >
      <QuizEngineProvider questionsArray={questionsArray}>
        <QuizInner />
      </QuizEngineProvider>
    </OakCloudinaryConfigProvider>
  );
};
