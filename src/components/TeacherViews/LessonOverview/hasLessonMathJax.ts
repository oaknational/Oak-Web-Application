import { LessonOverviewProps } from "./LessonOverview.view";

import {
  LessonOverviewQuizQuestion,
  StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const containsMathJax = (text: string | undefined | null): boolean => {
  if (!text) return false;
  const mathJaxPatterns = /(\$\$|\\\[|\\\(|\\begin\{)/;
  return mathJaxPatterns.test(text);
};

const hasQuizMathJax = (
  quizData: LessonOverviewQuizQuestion[] | undefined,
): boolean => {
  return (
    quizData?.some((question) => {
      // Check in the question stem
      const stemCheck = question.questionStem?.some(
        (stem) => stem.type === "text" && containsMathJax(stem.text),
      );

      // Check in answers by type
      const answerCheck = Object.entries(question.answers ?? {}).some(
        ([type, answers]) => {
          if (!Array.isArray(answers)) return false;

          const findMatch = (answer: StemObject[]) => {
            return answer.some(
              (a) => a.type === "text" && containsMathJax(a.text),
            );
          };

          switch (type) {
            case "multiple-choice":
              return question.answers?.["multiple-choice"]?.some((ans) =>
                findMatch(ans.answer),
              );

            case "match": {
              return question.answers?.match?.some((ans) =>
                findMatch(ans.match_option),
              );
            }
            case "order":
              return question.answers?.order?.some((ans) =>
                findMatch(ans.answer),
              );
            case "short-answer":
              return question.answers?.["short-answer"]?.some((ans) =>
                findMatch(ans.answer),
              );
            default:
              return false;
          }
        },
      );

      return stemCheck || answerCheck;
    }) ?? false
  );
};

export const hasLessonMathJax = (
  lessonPage: LessonOverviewProps["lesson"],
): boolean => {
  if (
    lessonPage.contentGuidance?.some((cg) =>
      containsMathJax(cg.contentGuidanceDescription),
    )
  ) {
    return true;
  }
  if (
    lessonPage.misconceptionsAndCommonMistakes?.some(
      (mcm) =>
        containsMathJax(mcm.misconception) || containsMathJax(mcm.response),
    )
  ) {
    return true;
  }
  if (lessonPage.teacherTips?.some((tt) => containsMathJax(tt.teacherTip))) {
    return true;
  }
  if (
    lessonPage.keyLearningPoints?.some((klp) =>
      containsMathJax(klp.keyLearningPoint),
    )
  ) {
    return true;
  }
  if (
    lessonPage.lessonKeywords?.some(
      (kw) => containsMathJax(kw.keyword) || containsMathJax(kw.description),
    )
  ) {
    return true;
  }

  return (
    hasQuizMathJax(lessonPage.exitQuiz || []) ||
    hasQuizMathJax(lessonPage.starterQuiz || [])
  );
};
