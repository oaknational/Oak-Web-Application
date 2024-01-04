import { createRef, useContext, useEffect, useRef } from "react";
import {
  OakFlex,
  OakImage,
  OakQuizCheckBox,
} from "@oak-academy/oak-components";

import {
  MCAnswer,
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

export type QuizMCQMultiAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
};

// Test with
// http://localhost:3000/pupils/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment#starter-quiz
// Multiple correct answers
// http://localhost:3000/pupils/programmes/maths-secondary-ks3/units/graphical-representations-of-data/lessons/constructing-bar-charts-by-utilising-technology#starter-quiz

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const { questionUid, answers } = props;

  const quizEngineContext = useContext(QuizEngineContext);

  const innerRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);

  const currentQuestionIndex = quizEngineContext?.currentQuestionIndex ?? 0;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];

  useEffect(() => {
    // Dynamically create the refs for the answers
    innerRefs.current = answers.map(() => createRef<HTMLInputElement>());
  }, [answers]);

  useEffect(() => {
    if (questionState?.mode === "grading") {
      // create a list of selected answers
      const selectedAnswers: MCAnswer[] = innerRefs.current
        .map((ref, index) => {
          return ref.current?.checked ? answers[index] : null;
        })
        .filter((answer): answer is MCAnswer => !!answer); // remove nulls

      quizEngineContext?.handleSubmitMCAnswer(selectedAnswers);
    }
  }, [questionState, answers, quizEngineContext]);

  if (!questionState) {
    return null;
  }

  const handleOnChange = () => {
    if (questionState?.mode === "init") {
      quizEngineContext?.updateQuestionMode("input");
    }
  };

  const isFeedbackMode = questionState.mode === "feedback";

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      {answers.map((answer, index) => {
        const filterByText = answer.answer.filter(
          (a) => a.type === "text",
        ) as StemTextObject[];
        const filterByImage = answer.answer.filter(
          (a) => a.type === "image",
        ) as StemImageObject[];
        const answerText = filterByText.length > 0 && filterByText[0];
        const answerImageData =
          filterByImage.length > 0 && filterByImage[0]?.image_object;

        const answerImage = answerImageData ? (
          <OakImage
            src={answerImageData.secure_url}
            alt=""
            width={answerImageData.width}
            height={answerImageData.height}
            $minWidth={"all-spacing-19"}
          />
        ) : undefined;

        const feedback = isFeedbackMode
          ? questionState.feedback?.[index]
          : undefined;

        return (
          <OakQuizCheckBox
            key={`${questionUid}-answer${index}`}
            id={`${questionUid}-answer${index}`}
            value={answerText ? answerText.text : ""}
            feedback={feedback}
            image={answerImage}
            innerRef={innerRefs.current[index]}
            onChange={handleOnChange}
          />
        );
      })}
    </OakFlex>
  );
};
