import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import convertToMml from "@/utils/mathjax";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export function convertQuestionMath(questions: LessonOverviewQuizData) {
  return questions?.map((question) => {
    if (question.questionStem) {
      return {
        ...question,
        questionStem: question.questionStem.map((questionStem) => {
          if (questionStem.type === "text") {
            // TODO: This should escape text here, rather than just replacing
            const html = questionStem.text.replace(
              /\$\$([^$]|$[^\$])*\$\$/g,
              (item: string) => {
                return convertToMml({ math: item });
              },
            );
            return {
              type: questionStem.type,
              text: questionStem.text,
              html,
            };
          } else {
            return questionStem;
          }
        }),
      };
    } else {
      return question;
    }
  });
}

export function convertQuizzes(content: LessonOverviewPageData) {
  return {
    ...content,
    starterQuiz: convertQuestionMath(content.starterQuiz),
    exitQuiz: convertQuestionMath(content.exitQuiz),
  };
}
