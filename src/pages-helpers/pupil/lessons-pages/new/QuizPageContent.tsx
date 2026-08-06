import { useEffect, useRef, useState } from "react";
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
import { isMatchAnswer } from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { usePupilExperienceBase } from "@/components/PupilComponents/Views/Hooks";

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
  const { router, currentSearchParams, goToSection, ensureCanProgress } =
    usePupilExperienceBase();
  const initialiseKeyRef = useRef<string | null>(null);
  const sectionStartedAtRef = useRef(Date.now());
  const {
    sectionResults,
    lessonReviewSections,
    lessonStarted,
    isReadOnly,
    setReadOnly,
    submitClassroomProgress,
    completeSection,
    updateSectionInProgressResult,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      setReadOnly: state.setReadOnly,
      submitClassroomProgress: state.submitClassroomProgress,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
    })),
  );
  const {
    storeLessonSlug,
    storeSection,
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
      storeLessonSlug: state.lessonSlug,
      storeSection: state.section,
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
  const isStoreReadyForSection =
    storeLessonSlug === lessonSlug && storeSection === section;
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
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompletingRef = useRef(false);
  const completionAttemptRef = useRef(0);
  const formId = "quiz-form";

  useEffect(
    () => () => {
      completionAttemptRef.current += 1;
      isCompletingRef.current = false;
    },
    [],
  );

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
    if (!isStoreReadyForSection || !isHydratedComplete) return;

    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: getHydratedQuizRedirectSection(section),
        searchParams: currentSearchParams,
      }),
    );
  }, [
    currentSearchParams,
    isStoreReadyForSection,
    isHydratedComplete,
    lessonSlug,
    router,
    section,
  ]);

  useEffect(() => {
    if (!isStoreReadyForSection) return;

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

    globalThis.addEventListener("keydown", handleKeyDownTabToInput);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDownTabToInput);
    };
  }, [
    currentQuestionData,
    currentQuestionIndex,
    firstTabPressed,
    isStoreReadyForSection,
  ]);

  const navigateToSection = (nextSection: "overview" | "review") => {
    goToSection(nextSection);
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

  const isQuizEffectivelyComplete = () => {
    const nextStep = getQuizNextStep({
      currentQuestionIndex,
      numQuestions,
      isReadOnly,
    });
    return (
      nextStep.action === "complete-quiz" &&
      currentQuestionState?.mode === "feedback"
    );
  };

  const completeQuizAndTrack = (
    nextSectionResults = getCompletedQuizSectionResults({
      section,
      sectionResults,
    }),
  ) => {
    completeSection(section);
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

    return nextSectionResults;
  };

  const finaliseQuiz = async () => {
    if (!ensureCanProgress() || isCompletingRef.current) return null;

    const nextSectionResults = getCompletedQuizSectionResults({
      section,
      sectionResults,
    });

    if (section === "exit-quiz") {
      const completionAttempt = ++completionAttemptRef.current;
      isCompletingRef.current = true;
      setIsCompleting(true);
      try {
        const result = await submitClassroomProgress(nextSectionResults);
        if (completionAttemptRef.current !== completionAttempt) return null;
        if (result?.status === "READ_ONLY") {
          setReadOnly(true);
          navigateToSection("review");
          return null;
        }
      } catch {
        return null;
      } finally {
        if (completionAttemptRef.current === completionAttempt) {
          isCompletingRef.current = false;
          setIsCompleting(false);
        }
      }
    }

    return completeQuizAndTrack(nextSectionResults);
  };

  const onNext = async () => {
    const nextStep = getQuizNextStep({
      currentQuestionIndex,
      numQuestions,
      isReadOnly,
    });

    // use cached state so next-question navigation stays immediate
    if (nextStep.action === "next-question") {
      handleNextQuestion();
      return;
    }

    if (nextStep.action === "go-review") {
      trackSectionStarted({ section: "review", sectionResults });
      navigateToSection("review");
      return;
    }

    const nextSectionResults = await finaliseQuiz();
    if (!nextSectionResults) return;
    navigateToSection(
      getQuizCompletionDestination({
        sectionResults: nextSectionResults,
        lessonReviewSections,
      }),
    );
  };

  const onBack = () => {
    if (isCompletingRef.current) {
      completionAttemptRef.current += 1;
      isCompletingRef.current = false;
      setIsCompleting(false);
      navigateToSection("overview");
      return;
    }

    const alreadyComplete = sectionResults[section]?.isComplete;

    if (!alreadyComplete && isQuizEffectivelyComplete()) {
      if (!ensureCanProgress()) return;
      completeQuizAndTrack();
    } else if (!alreadyComplete) {
      if (!lessonStarted) {
        trackLessonStarted();
      }
      trackQuizAbandoned({
        section,
        sectionResults,
        sectionStartedAt: sectionStartedAtRef.current,
      });
    }

    navigateToSection("overview");
  };

  const isFeedbackMode = currentQuestionState?.mode === "feedback";
  const isExplanatoryText =
    currentQuestionData?.questionType === "explanatory-text";
  const isCorrect = currentQuestionState?.grade === 1;
  const isPartiallyCorrect = currentQuestionState?.isPartiallyCorrect;

  const renderAnswerFeedback = () => {
    if (isCorrect) {
      return <OakSpan $font="body-2">Well done!</OakSpan>;
    }

    if (
      !currentQuestionData?.answers ||
      isMatchAnswer(currentQuestionData.answers)
    ) {
      return null;
    }

    return (
      <MathJaxWrap>
        <QuizCorrectAnswers questionState={currentQuestionState} />
      </MathJaxWrap>
    );
  };

  if (!isStoreReadyForSection) {
    return null;
  }

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
                  onBack();
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
            answerFeedback: renderAnswerFeedback(),
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
                  isLoading={isCompleting}
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
