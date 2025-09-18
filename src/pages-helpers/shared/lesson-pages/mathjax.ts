import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { stemToPortableText } from "@/components/SharedComponents/Stem";

export function convertQuestionMath(questions: LessonOverviewQuizData) {
  return questions?.map((question) => {
    let newQuestionStem = question.questionStem;
    if (question.questionStem) {
      newQuestionStem = question.questionStem.map((questionStem) => {
        if (questionStem.type === "text") {
          return {
            type: questionStem.type,
            text: questionStem.text,
            portableText: stemToPortableText(questionStem.text, "h4"),
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
                  const portableText = stemToPortableText(answerItem.text);
                  return {
                    ...answerItem,
                    portableText,
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
                const portableText = stemToPortableText(answer.text);
                return {
                  ...answer,
                  portableText,
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
      if (multipleChoiceAnswers) {
        newAnswers = {
          ...newAnswers,
          "multiple-choice": multipleChoiceAnswers.map((item) => {
            if (item.answer && item.answer.length > 0) {
              const newItemAnswer = item.answer.map((answerItem) => {
                if (answerItem.type === "text") {
                  const portableText = stemToPortableText(answerItem.text);
                  return {
                    ...answerItem,
                    portableText,
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
      if (matchAnswers) {
        newAnswers = {
          ...newAnswers,
          match: matchAnswers.map((item) => {
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
