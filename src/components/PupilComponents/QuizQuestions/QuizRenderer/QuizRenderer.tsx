import { FormEvent } from "react";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import { QuizMultiQuestion } from "../QuizMultiQuestion";
import { QuizSingleQuestion } from "../QuizSingleQuestion";
import { QuizShortQuestion } from "../QuizShortQuestion";
import { QuizOrderQuestion } from "../QuizOrderQuestion";
import { QuizMatchQuestion } from "../QuizMatchQuestion";

import type { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestions/QuizQuestionStem";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { QuizAttribution } from "@/components/PupilComponents/QuizQuestions/QuizAttribution";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";
import {
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";

type Props = {
  formId: string;
  currentQuestionData?: QuizQuestion;
  currentQuestionIndex: number;
  currentQuestionState?: QuestionState;
  section: QuizSection;
  isReadOnly: boolean;
  onChange: () => void;
  onQuestionModeChange: (mode: QuestionModeType) => void;
  onSubmit: (formData: FormData) => void;
};

export const QuizRenderer = ({
  formId,
  currentQuestionData,
  currentQuestionIndex,
  currentQuestionState,
  section,
  isReadOnly,
  onChange,
  onQuestionModeChange,
  onSubmit,
}: Props) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(formData);
  };

  const answerRender = (() => {
    if (!currentQuestionData?.answers || !currentQuestionState) return null;

    if (isMultiAnswerMCQ(currentQuestionData.answers)) {
      return (
        <QuizMultiQuestion
          section={section}
          questionData={currentQuestionData}
          questionState={currentQuestionState}
          isReadOnly={isReadOnly}
          onChange={onChange}
        />
      );
    }

    if (isSingleAnswerMCQ(currentQuestionData.answers)) {
      return (
        <QuizSingleQuestion
          section={section}
          questionData={currentQuestionData}
          questionState={currentQuestionState}
          isReadOnly={isReadOnly}
          onChange={onChange}
        />
      );
    }

    if (isShortAnswer(currentQuestionData.answers)) {
      return (
        <QuizShortQuestion
          section={section}
          questionData={currentQuestionData}
          questionState={currentQuestionState}
          isReadOnly={isReadOnly}
          onChange={onChange}
        />
      );
    }

    if (isOrderAnswer(currentQuestionData.answers)) {
      return (
        <QuizOrderQuestion
          section={section}
          questionData={currentQuestionData}
          questionState={currentQuestionState}
          isReadOnly={isReadOnly}
          onChange={onChange}
          onQuestionModeChange={onQuestionModeChange}
        />
      );
    }

    if (isMatchAnswer(currentQuestionData.answers)) {
      return (
        <QuizMatchQuestion
          section={section}
          questionData={currentQuestionData}
          questionState={currentQuestionState}
          isReadOnly={isReadOnly}
          onQuestionModeChange={onQuestionModeChange}
        />
      );
    }

    return null;
  })();

  return (
    <OakFlex
      $flexDirection="column"
      $alignItems="center"
      $color="text-subdued"
      $pa={["spacing-0", "spacing-24"]}
      $width="100%"
      $height="100%"
    >
      {currentQuestionData && (
        <OakBox
          key={`${currentQuestionData.questionUid}-${currentQuestionIndex}`}
          as="form"
          id={formId}
          onSubmit={handleSubmit}
          $maxWidth={["100%", "spacing-640", "spacing-960"]}
          $minWidth={["100%", "spacing-480", "spacing-960"]}
          $ph={["spacing-16", "spacing-0", "spacing-24"]}
          $height="100%"
        >
          <OakFlex $flexDirection="column" $gap="spacing-24" $height="100%">
            <MathJaxWrap>
              {currentQuestionData.questionStem && (
                <QuizQuestionStem
                  questionUid={currentQuestionData.questionUid}
                  questionStem={currentQuestionData.questionStem}
                  index={currentQuestionIndex}
                  takeFullHeight={
                    currentQuestionData.questionType === "explanatory-text"
                  }
                />
              )}
              {answerRender}
            </MathJaxWrap>
            <QuizAttribution questionData={currentQuestionData} />
          </OakFlex>
        </OakBox>
      )}
    </OakFlex>
  );
};
