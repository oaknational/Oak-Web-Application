import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import convertToMml from "@/utils/mathjax";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

// TODO: This should escape text here, rather than just replacing
export const generateHtml = (text: string) => {
  return text.replace(/\$\$([^$]|$[^\$])*\$\$/g, (item: string) => {
    return convertToMml({ math: item });
  });
};

export function convertQuestionMath(questions: LessonOverviewQuizData) {
  return questions?.map((question) => {
    let newQuestionStem = question.questionStem;
    if (question.questionStem) {
      newQuestionStem = question.questionStem.map((questionStem) => {
        if (questionStem.type === "text") {
          const html = generateHtml(questionStem.text);
          return {
            type: questionStem.type,
            text: questionStem.text,
            html,
          };
        } else {
          return questionStem;
        }
      });
    }
    let newAnswers = question.answers;
    if (question.answers) {
      const multipleChoiceAnswers = question.answers["multiple-choice"];
      const matchAnswers = question.answers["match"];
      const orderAnswers = question.answers["order"];
      const shortAnswers = question.answers["short-answer"];

      if (orderAnswers) {
        newAnswers = {
          ...newAnswers,
          order: orderAnswers.map((item) => {
            if (item.answer && item.answer.length > 0) {
              const newItemAnswer = item.answer.map((answerItem) => {
                if (answerItem.type === "text") {
                  const html = generateHtml(answerItem.text);
                  return {
                    ...answerItem,
                    html,
                  };
                } else {
                  return answerItem;
                }
              });
              return {
                ...item,
                answer: newItemAnswer,
              };
            } else {
              return item;
            }
          }),
        };
      }
      if (shortAnswers) {
        newAnswers = {
          ...newAnswers,
          "short-answer": shortAnswers.map((item) => {
            const answer = item.answer.map((answer) => {
              if (answer.type === "text") {
                const html = generateHtml(answer.text);
                return {
                  ...answer,
                  html,
                };
              } else {
                return answer;
              }
            });
            return {
              ...item,
              answer,
            };
          }),
        };
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
