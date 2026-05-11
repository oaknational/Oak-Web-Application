import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  OakBackLink,
  OakCloudinaryConfigProvider,
  OakCodeRenderer,
  OakSpan,
} from "@oaknational/oak-components";
import { useShallow } from "zustand/react/shallow";

import {
  getCompletedQuizSectionResults,
  getHydratedQuizRedirectSection,
  getQuizCompletionDestination,
  gradeQuestionFromFormData,
} from "./quizPageContentHelpers";

import {
  PupilLessonQuizCheckButton,
  PupilLessonQuizNextButton,
  PupilLessonQuizView,
  QuizSection,
} from "@/components/PupilComponents/Views/PupilLessonQuiz";
import {
  getNewLessonSectionHref,
  getQuizNextStep,
  pickQuizFeedbackState,
  pickQuizNavigationButtonLabel,
  pickQuizTooltip,
} from "@/components/PupilComponents/Views/ViewHelpers";
import {
  QuizCorrectAnswers,
  QuizRenderer,
} from "@/components/PupilComponents/QuizQuestions";
import { pickQuizTabId } from "@/components/PupilComponents/QuizQuestions/helpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import {
  buildPersistedQuizResult,
  getCurrentQuestionDisplayIndex,
  QuestionsArray,
  usePupilLessonQuiz,
} from "@/context/PupilLessonQuiz";

type QuizPageContentProps = {
  section: QuizSection;
  questionsArray: QuestionsArray;
  lessonSlug: string;
  phase: "primary" | "secondary";
};

export const QuizPageContent = ({
  section,
  questionsArray,
  lessonSlug,
  phase,
}: QuizPageContentProps) => {
  const router = useRouter();
  const currentSearchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  );
  const initialiseKeyRef = useRef<string | null>(null);
  const sectionStartedAtRef = useRef(Date.now());
  const {
    sectionResults,
    lessonReviewSections,
    lessonStarted,
    isReadOnly,
    completeSection,
    updateSectionInProgressResult,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
    })),
  );
  const {
    currentQuestionIndex,
    questionState,
    numQuestions,
    numInteractiveQuestions,
    isHydratedComplete,
    initialiseQuiz,
    updateQuestionMode,
    updateHintOffered,
    applyCurrentQuestionResult,
    handleNextQuestion,
  } = usePupilLessonQuiz(
    useShallow((state) => ({
      currentQuestionIndex: state.currentQuestionIndex,
      questionState: state.questionState,
      numQuestions: state.numQuestions,
      numInteractiveQuestions: state.numInteractiveQuestions,
      isHydratedComplete: state.isHydratedComplete,
      initialiseQuiz: state.initialiseQuiz,
      updateQuestionMode: state.updateQuestionMode,
      updateHintOffered: state.updateHintOffered,
      applyCurrentQuestionResult: state.applyCurrentQuestionResult,
      handleNextQuestion: state.handleNextQuestion,
    })),
  );
  const {
    trackSectionStarted,
    trackQuizQuestionAttempt,
    trackQuizCompleted,
    trackQuizAbandoned,
    trackLessonStarted,
    trackLessonCompleted,
  } = usePupilLessonAnalytics();
  const currentQuestionData = questionsArray[currentQuestionIndex];
  const currentQuestionState = questionState[currentQuestionIndex];
  const currentQuestionDisplayIndex = getCurrentQuestionDisplayIndex({
    currentQuestionIndex,
    numQuestions,
    numInteractiveQuestions,
  });
  const [firstTabPressed, setFirstTabPressed] = useState<{
    questionIndex: number;
    pressed: boolean;
  }>({ questionIndex: currentQuestionIndex, pressed: false });
  const formId = "quiz-form";

  useEffect(() => {
    const initialiseKey = `${lessonSlug}:${section}`;
    if (initialiseKeyRef.current === initialiseKey) return;
    initialiseKeyRef.current = initialiseKey;
    sectionStartedAtRef.current = Date.now();

    initialiseQuiz({
      lessonSlug,
      section,
      questionsArray,
      initialQuestionResults: sectionResults[section]?.questionResults,
    });
  }, [initialiseQuiz, lessonSlug, questionsArray, section, sectionResults]);

  useEffect(() => {
    if (!isHydratedComplete) return;

    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: getHydratedQuizRedirectSection(section),
        searchParams: currentSearchParams,
      }),
    );
  }, [currentSearchParams, isHydratedComplete, lessonSlug, router, section]);

  useEffect(() => {
    const handleKeyDownTabToInput = (event: KeyboardEvent): void => {
      if (event.key !== "Tab" || firstTabPressed.pressed) return;

      setFirstTabPressed((prev) => ({ ...prev, pressed: true }));
      const answers = currentQuestionData?.answers;
      if (!answers) return;

      const tabId = pickQuizTabId(answers, currentQuestionData.questionUid);
      if (!tabId) return;

      event.preventDefault();
      document.getElementById(tabId)?.focus();
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
  }, [currentQuestionData, currentQuestionIndex, firstTabPressed]);

  const navigateToSection = (nextSection: "overview" | "review") => {
    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: nextSection,
        searchParams: currentSearchParams,
      }),
    );
  };

  const persistCurrentQuizState = () => {
    const nextQuestionState = usePupilLessonQuiz.getState().questionState;
    updateSectionInProgressResult(
      section,
      buildPersistedQuizResult({
        questionState: nextQuestionState,
        numInteractiveQuestions,
      }),
    );
  };

  const handleQuestionResult = (
    result: Parameters<typeof applyCurrentQuestionResult>[0],
  ) => {
    applyCurrentQuestionResult(result);
    persistCurrentQuizState();

    trackQuizQuestionAttempt({
      section,
      questionType: currentQuestionData?.questionType ?? "",
      isCorrect: result.grade === 1,
      hintAvailable: Boolean(currentQuestionData?.hint),
      hintAccessed: Boolean(currentQuestionState?.offerHint),
      questionNumber: currentQuestionIndex + 1,
    });
  };

  const handleSubmit = (formData: FormData) => {
    if (!currentQuestionData || !currentQuestionState) return;

    if (currentQuestionState.mode === "init") {
      updateQuestionMode("incomplete");
      return;
    }

    if (currentQuestionState.mode === "incomplete") {
      return;
    }

    updateQuestionMode("grading");
    const result = gradeQuestionFromFormData({
      currentQuestionData,
      formData,
    });
    if (!result) return;
    handleQuestionResult(result);
  };

  const onNext = () => {
    const nextStep = getQuizNextStep({
      currentQuestionIndex,
      numQuestions,
      isReadOnly,
    });

    if (nextStep.action === "next-question") {
      handleNextQuestion();
      return;
    }

    if (nextStep.action === "go-review") {
      trackSectionStarted({ section: "review", sectionResults });
      navigateToSection("review");
      return;
    }

    completeSection(section);
    const nextSectionResults = getCompletedQuizSectionResults({
      section,
      sectionResults,
    });
    if (!lessonStarted) {
      trackLessonStarted();
    }

    trackQuizCompleted({
      section,
      sectionResults: nextSectionResults,
      sectionStartedAt: sectionStartedAtRef.current,
    });
    if (
      lessonReviewSections.every(
        (reviewSection) => nextSectionResults[reviewSection]?.isComplete,
      )
    ) {
      trackLessonCompleted();
    }

    navigateToSection(
      getQuizCompletionDestination({
        sectionResults: nextSectionResults,
        lessonReviewSections,
      }),
    );
  };

  const isFeedbackMode = currentQuestionState?.mode === "feedback";
  const isExplanatoryText =
    currentQuestionData?.questionType === "explanatory-text";
  const isCorrect = currentQuestionState?.grade === 1;
  const isPartiallyCorrect = currentQuestionState?.isPartiallyCorrect;

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
      <MathJaxProvider>
        <PupilLessonQuizView
          lessonSectionName={section}
          phase={phase}
          celebrate={isCorrect}
          topNav={{
            section,
            backLinkSlot: (
              <OakBackLink
                href={getNewLessonSectionHref({
                  currentRoute: router.asPath,
                  section: "overview",
                  searchParams: currentSearchParams,
                })}
                label="Back"
                onClick={(event) => {
                  event.preventDefault();
                  if (!sectionResults[section]?.isComplete) {
                    if (!lessonStarted) {
                      trackLessonStarted();
                    }
                    trackQuizAbandoned({ section, sectionResults });
                  }
                  navigateToSection("overview");
                }}
              />
            ),
            isExplanatoryText,
            currentQuestion: currentQuestionDisplayIndex + 1,
            totalQuestions: numInteractiveQuestions,
          }}
          bottomNav={{
            hint: currentQuestionData?.hint && (
              <MathJaxWrap>
                <OakCodeRenderer
                  string={currentQuestionData.hint}
                  $font="code-3"
                />
              </MathJaxWrap>
            ),
            onHintToggled: ({ isOpen }) => {
              if (isOpen) {
                updateHintOffered(true);
              }
            },
            feedback: isFeedbackMode
              ? pickQuizFeedbackState(isCorrect, isPartiallyCorrect)
              : null,
            answerFeedback: isCorrect ? (
              <OakSpan $font="body-2">Well done!</OakSpan>
            ) : (
              <QuizCorrectAnswers questionState={currentQuestionState} />
            ),
            actionSlot:
              currentQuestionData?.answers &&
              !isFeedbackMode &&
              !isExplanatoryText ? (
                <PupilLessonQuizCheckButton
                  formId={formId}
                  disabled={isReadOnly && section === "exit-quiz"}
                  tooltip={pickQuizTooltip(currentQuestionData.answers)}
                  isTooltipOpen={currentQuestionState?.mode === "incomplete"}
                />
              ) : (
                <PupilLessonQuizNextButton
                  label={pickQuizNavigationButtonLabel({
                    currentQuestionIndex,
                    numQuestions,
                    currentSection: section,
                  })}
                  onClick={onNext}
                />
              ),
          }}
          questionSlot={
            <QuizRenderer
              formId={formId}
              currentQuestionData={currentQuestionData}
              currentQuestionIndex={currentQuestionIndex}
              currentQuestionState={currentQuestionState}
              section={section}
              isReadOnly={isReadOnly}
              onChange={() => {
                updateQuestionMode("input");
              }}
              onQuestionModeChange={updateQuestionMode}
              onSubmit={handleSubmit}
            />
          }
        />
      </MathJaxProvider>
    </OakCloudinaryConfigProvider>
  );
};
