import {
  AnswersSchema,
  LessonOverviewQuizData,
  StemImageObject,
  StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { stemToPortableText } from "@/utils/portableText";
import { TextItem } from "@oaknational/oak-curriculum-schema";
import { StemPortableText } from "@/components/SharedComponents/Stem";

export function convertQuestionItem<T extends TextItem | StemImageObject>(
  answer: T,
): T | StemPortableText {
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
  T extends { answer?: Array<TextItem | StemImageObject> },
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

export function convertQuestionMath<
  T extends
    | Array<{
        questionStem?: Array<StemObject>;
        answers?: AnswersSchema | null;
      }>
    | undefined
    | null,
>(questions: T) {
  return questions?.map((question) => {
    let newQuestionStem = question.questionStem;
    if (question.questionStem) {
      newQuestionStem = question.questionStem.map(convertQuestionItem);
    }
    let newAnswers = question.answers;
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

export function convertQuizzes(content: LessonOverviewPageData) {
  return {
    ...content,
    starterQuiz: convertQuestionMath(content.starterQuiz),
    exitQuiz: convertQuestionMath(content.exitQuiz),
  };
}
