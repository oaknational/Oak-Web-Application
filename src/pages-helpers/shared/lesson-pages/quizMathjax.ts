import { TextItem } from "@oaknational/oak-curriculum-schema";

import {
  LessonOverviewQuizData,
  StemImageObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { stemToPortableText } from "@/utils/portableText";
import { StemPortableText } from "@/components/SharedComponents/Stem";
import {
  QuizQuestion,
  QuizQuestionWithHtml,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

/**
 * Functions to convert mathjax within pupil and teacher quizzes into server rendered SVGs
 */
export function convertQuestionMathIdentity<T extends LessonOverviewQuizData>(
  value: T,
): T;

export function convertQuestionMathIdentity<T extends QuizQuestionWithHtml[]>(
  questions: T,
): T;

export function convertQuestionMathIdentity<
  T extends QuizQuestion[] | LessonOverviewQuizData,
>(questions: T) {
  return questions?.map((question) => {
    let newQuestionStem = question.questionStem;
    if (question.questionStem) {
      newQuestionStem = question.questionStem
        .map(convertQuestionItem)
        .filter((q) => !!q);
    }
    const newAnswers = question.answers;
    if (newAnswers) {
      const multipleChoiceAnswers = newAnswers["multiple-choice"];
      const matchAnswers = newAnswers["match"];
      const orderAnswers = newAnswers["order"];
      // short answers don't require conversion

      if (orderAnswers) {
        newAnswers.order = orderAnswers.map(convertQuestionItemArray);
      }
      if (multipleChoiceAnswers) {
        newAnswers["multiple-choice"] = multipleChoiceAnswers.map(
          convertQuestionItemArray,
        );
      }
      if (matchAnswers) {
        newAnswers.match = matchAnswers.map((item) => {
          const newMatchOption = item.matchOption.map((mo) => ({
            ...mo,
            portableText: stemToPortableText(mo.text, "h4"),
          }));
          const newCorrectChoice = item.correctChoice.map((cc) => ({
            ...cc,
            portableText: stemToPortableText(cc.text),
          }));
          return {
            ...item,
            matchOption: newMatchOption,
            correctChoice: newCorrectChoice,
          };
        });
      }
    }

    return {
      ...question,
      questionStem: newQuestionStem,
      answers: newAnswers,
    };
  });
}

export function convertQuestionItem<
  T extends TextItem | StemImageObject | undefined,
>(answer: T): T | StemPortableText {
  if (answer && answer.type === "text") {
    const portableText = stemToPortableText(answer.text);
    return {
      ...answer,
      portableText,
    };
  }
  return answer;
}

export function convertQuestionItemArray<
  T extends { answer?: Array<TextItem | StemImageObject | undefined> },
>(item: T) {
  if (item.answer && item.answer.length > 0) {
    const newItemAnswer = item.answer.map(convertQuestionItem);
    return {
      ...item,
      answer: newItemAnswer,
    };
  } else {
    return item;
  }
}
