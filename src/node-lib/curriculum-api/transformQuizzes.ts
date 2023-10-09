import {
  AnswersSchema,
  StemImageObject,
  LessonOverviewQuizData,
  StemTextObject,
  MCAnswer,
} from "../curriculum-api-2023/shared.schema";

import { LegacyQuizData } from "./legacyQuiz.schema";

const questionTypeMap = (questionType?: string | null) => {
  switch (questionType) {
    case "text":
    case undefined:
    case null:
      return "explanatory-text" as keyof AnswersSchema;
    case "checkbox":
    case "dropdown":
      return "multiple-choice" as keyof AnswersSchema;
    default:
      return questionType as keyof AnswersSchema;
  }
};

const transformImageData = (
  imageData: string | { title: string | null; images: string[] },
) => {
  if (typeof imageData === "string") {
    const image: StemImageObject = {
      image_object: {
        url: imageData,
        secure_url: imageData,
        metadata: {},
      },
      type: "image",
    };
    return image;
  }
  return imageData.images.map((image_url) => {
    const image: StemImageObject = {
      image_object: {
        url: image_url,
        secure_url: image_url,
        metadata: {},
      },
      type: "image",
    };
    return image;
  });
};

export const transformQuiz = (quizQuestions: LegacyQuizData[]) => {
  const transformedQuestions: LessonOverviewQuizData = quizQuestions.map(
    (quizQuestion) => {
      quizQuestion.choices?.sort((a, b) => a.choice.localeCompare(b.choice));

      const answers: AnswersSchema = {};

      switch (quizQuestion.type) {
        case "multiple-choice":
        case "checkbox":
        case "dropdown": {
          answers["multiple-choice"] = quizQuestion.choices?.map((choice) => {
            const answerElems: (StemTextObject | StemImageObject)[] = [];

            if (choice.image) {
              const image = transformImageData(choice.image);
              if (Array.isArray(image)) {
                answerElems.push(...image);
              } else {
                answerElems.push(image);
              }
            }

            answerElems.push({ text: choice.choice, type: "text" });
            const a: MCAnswer = {
              answer: answerElems,
              answer_is_correct:
                choice.choice === quizQuestion.answer ||
                (Array.isArray(quizQuestion.answer) &&
                  quizQuestion.answer?.includes(choice.choice)) ||
                false,
            };
            return a;
          });
          break;
        }
        case "match": {
          if (
            quizQuestion.choices &&
            quizQuestion.choices.length > 0 &&
            quizQuestion.answer &&
            quizQuestion.answer.length === quizQuestion.choices.length
          ) {
            answers.match = quizQuestion.choices.map((choice, i) => {
              return {
                correct_choice: [
                  {
                    text: quizQuestion.answer
                      ? quizQuestion.answer[i] || "null string"
                      : "null string",
                    type: "text",
                  },
                ],
                match_option: [
                  {
                    text: choice.choice,
                    type: "text",
                  },
                ],
              };
            });
          }

          break;
        }
        case "order": {
          if (!quizQuestion.answer || !Array.isArray(quizQuestion.answer)) {
            answers.order = [];
          } else {
            answers.order = quizQuestion.answer.map((choice, i) => {
              return {
                answer: [{ text: choice, type: "text" }],
                correct_order: i + 1,
              };
            });
          }
          break;
        }
        case "short-answer": {
          if (!quizQuestion.answer || !Array.isArray(quizQuestion.answer)) {
            answers["short-answer"] = [];
          } else {
            answers["short-answer"] = quizQuestion.answer.map((choice, i) => {
              return {
                answer: [{ text: choice, type: "text" }],
                answer_is_default: i === 0,
              };
            });
          }
          break;
        }
        default: {
          break;
        }
      }

      const questionStem: (StemImageObject | StemTextObject)[] = [
        { text: quizQuestion.title ?? "", type: "text" },
      ];

      if (quizQuestion.images && quizQuestion.images.length > 0) {
        quizQuestion.images.forEach((image) => {
          const t = transformImageData(image);
          if (Array.isArray(t)) {
            questionStem.push(...t);
          } else {
            questionStem.push(t);
          }
        });
      }

      const transformedQuestion: NonNullable<LessonOverviewQuizData>[number] = {
        questionId: 0,
        questionUid: "",
        questionType: questionTypeMap(quizQuestion.type),
        questionStem,
        answers,
        feedback: "",
        hint: "",
        active: quizQuestion.active ?? false,
      };
      return transformedQuestion;
    },
  );

  return transformedQuestions;
};
