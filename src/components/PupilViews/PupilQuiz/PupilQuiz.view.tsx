import { useEffect, useState } from "react";
import {
  OakCloudinaryConfigProvider,
  OakBackLink,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonTopNav,
  OakPrimaryButton,
  OakQuizCounter,
  OakSpan,
  OakTooltip,
  OakCodeRenderer,
  OakQuizOrderitemId,
  OakQuizMatchItemId,
} from "@oaknational/oak-components";

import {
  QuestionsArray,
  QuizEngineProvider,
  useQuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { QuizCorrectAnswers } from "@/components/PupilComponents/QuizCorrectAnswers";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { useGetQuizTrackingData } from "@/hooks/useGetQuizTrackingData";
import { shortAnswerInputId } from "@/components/PupilComponents/QuizShortAnswer";
import { multipleChoiceAnswerId } from "@/components/PupilComponents/QuizMCQMultiAnswer";

type PupilViewsQuizProps = {
  questionsArray: QuestionsArray;
};

type QuizSection = "starter-quiz" | "exit-quiz";

const isQuizSection = (section: string): section is QuizSection => {
  return ["starter-quiz", "exit-quiz"].includes(section);
};

const QuizInner = () => {
  const { currentSection, updateCurrentSection, completeActivity } =
    useLessonEngineContext();
  const quizEngineContext = useQuizEngineContext();
  const {
    currentQuestionData,
    currentQuestionIndex,
    currentQuestionDisplayIndex,
    questionState,
    handleNextQuestion,
    updateHintOffered,
    numQuestions,
    numInteractiveQuestions,
  } = quizEngineContext;

  const getSectionLinkProps = useGetSectionLinkProps();
  const { track } = usePupilAnalytics();
  const { getQuizTrackingData } = useGetQuizTrackingData();
  const [firstTabPressed, setFirstTabPressed] = useState<{
    questionIndex: number;
    pressed: boolean;
  }>({ questionIndex: currentQuestionIndex, pressed: false });

  useEffect(() => {
    const handleKeyDownTabToInput = (event: KeyboardEvent): void => {
      if (event.key === "Tab") {
        if (!firstTabPressed.pressed) {
          setFirstTabPressed((prev) => {
            return { questionIndex: prev.questionIndex, pressed: true };
          });
          const answers = currentQuestionData?.answers;
          if (answers) {
            const tabId = pickTabId(answers, currentQuestionData.questionUid);
            if (tabId) {
              event.preventDefault();
              const tabElement = document.getElementById(tabId);
              if (tabElement) {
                tabElement.focus();
              }
            }
          }
        }
      }
    };
    if (firstTabPressed.questionIndex !== currentQuestionIndex) {
      setFirstTabPressed({
        questionIndex: currentQuestionIndex,
        pressed: false,
      });
    }
    window.addEventListener("keydown", handleKeyDownTabToInput);
    return () => {
      window.removeEventListener("keydown", handleKeyDownTabToInput);
    };
  }, [currentQuestionIndex, firstTabPressed, currentQuestionData]);

  if (!isQuizSection(currentSection)) {
    return null;
  }

  const formId = "quiz-form";
  const currentQuestionState = questionState[currentQuestionIndex];
  const isFeedbackMode = currentQuestionState?.mode === "feedback";
  const isExplanatoryText =
    currentQuestionData?.questionType === "explanatory-text";
  const grade = currentQuestionState?.grade;
  const isPartiallyCorrect = currentQuestionState?.isPartiallyCorrect;
  const isCorrect = grade === 1;

  const handleNextQuestionClick = () => {
    const _currentQuestionIndex = Math.min(
      currentQuestionIndex + 1,
      numQuestions,
    );
    if (_currentQuestionIndex === numQuestions) {
      if (currentSection === "starter-quiz") {
        track.lessonActivityCompletedStarterQuiz(
          getQuizTrackingData(currentSection),
        );
      } else if (currentSection === "exit-quiz") {
        track.lessonActivityCompletedExitQuiz(
          getQuizTrackingData(currentSection),
        );
      } else {
        throw new Error(`Invalid section: ${currentSection}`);
      }
      completeActivity(currentSection);
    } else {
      handleNextQuestion();
    }
  };

  const correctFeedback = (
    <OakSpan $color={"text-primary"} $font={"body-2"}>
      Well done!
    </OakSpan>
  );

  const incorrectFeedback = (answers: QuestionsArray[number]["answers"]) => {
    if (answers && !isMatchAnswer(answers)) {
      return (
        <MathJaxWrap>
          <QuizCorrectAnswers />
        </MathJaxWrap>
      );
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
      hint={
        currentQuestionData?.hint && (
          <MathJaxWrap>
            <OakCodeRenderer
              string={currentQuestionData.hint}
              $font={"code-3"}
            />
          </MathJaxWrap>
        )
      }
      hintToggled={({ isOpen }: { isOpen: boolean }) => {
        if (isOpen) {
          updateHintOffered(true);
        }
      }}
      feedback={
        isFeedbackMode ? pickFeedback(isCorrect, isPartiallyCorrect) : null
      }
      answerFeedback={
        isCorrect
          ? correctFeedback
          : incorrectFeedback(currentQuestionData?.answers)
      }
    >
      {currentQuestionData?.answers &&
        !isFeedbackMode &&
        !isExplanatoryText && (
          <OakTooltip
            tooltip={pickTooltip(currentQuestionData.answers)}
            isOpen={currentQuestionState?.mode === "incomplete"}
            tooltipPosition="top-right"
            id="quiz-tooltip"
          >
            <OakPrimaryButton
              form={formId}
              type="submit"
              isTrailingIcon
              iconName="arrow-right"
              width={["100%", "max-content"]}
              aria-describedby={
                currentQuestionState?.mode === "incomplete"
                  ? "quiz-tooltip"
                  : undefined
              }
            >
              Check
            </OakPrimaryButton>
          </OakTooltip>
        )}
      {(isFeedbackMode || isExplanatoryText) && (
        <OakPrimaryButton
          width={["100%", "max-content"]}
          onClick={handleNextQuestionClick}
          isTrailingIcon
          iconName="arrow-right"
        >
          {navigationButtonCopy}
        </OakPrimaryButton>
      )}
    </OakLessonBottomNav>
  );

  const handleBackLinkClick = () => {
    switch (currentSection) {
      case "starter-quiz":
        if (track.lessonActivityAbandonedStarterQuiz) {
          track.lessonActivityAbandonedStarterQuiz(
            getQuizTrackingData(currentSection),
          );
        }
        break;
      case "exit-quiz":
        if (track.lessonActivityAbandonedExitQuiz) {
          track.lessonActivityAbandonedExitQuiz(
            getQuizTrackingData(currentSection),
          );
        }
        break;
      default:
        throw new Error(`Invalid section: ${currentSection}`);
    }
    updateCurrentSection("overview");
  };

  const topNavSlot = (
    <OakLessonTopNav
      backLinkSlot={
        <OakBackLink
          {...getSectionLinkProps("overview", handleBackLinkClick)}
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
      celebrate={isCorrect}
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
        <MathJaxProvider>
          <QuizInner />
        </MathJaxProvider>
      </QuizEngineProvider>
    </OakCloudinaryConfigProvider>
  );
};

function pickTooltip(answers: QuizQuestionAnswers) {
  switch (true) {
    case isOrderAnswer(answers):
      return "You need to order to move on!";
    case isMatchAnswer(answers):
      return "You need to match to move on!";
    case isShortAnswer(answers):
      return "You need to type an answer to move on!";
    case isMultiAnswerMCQ(answers):
      return "You need to select answers to move on!";
    case isSingleAnswerMCQ(answers):
      return "You need to select an answer to move on!";
  }
}

function pickTabId(
  answers: QuizQuestionAnswers,
  questionUid: string | undefined,
) {
  switch (true) {
    case isOrderAnswer(answers):
      return OakQuizOrderitemId("0");
    case isMatchAnswer(answers):
      return OakQuizMatchItemId("0");
    case isShortAnswer(answers):
      return shortAnswerInputId(questionUid);
    case isMultiAnswerMCQ(answers):
      return multipleChoiceAnswerId(questionUid, 0);
    case isSingleAnswerMCQ(answers):
      return multipleChoiceAnswerId(questionUid, 0);
  }
}
