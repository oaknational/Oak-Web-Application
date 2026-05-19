import { QuizResults } from "@/components/PupilComponents/QuizQuestions";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import {
  LessonReviewSection,
  LessonSectionResults,
} from "@/context/PupilLessonProgress";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const getReviewSections = (
  lessonContent: LessonContent,
  lessonReviewSections: Readonly<LessonReviewSection[]>,
  sectionResults: LessonSectionResults,
) => {
  return lessonReviewSections.map((section) => {
    if (section === "intro" || section === "video") {
      return {
        section,
        completed: !!sectionResults[section]?.isComplete,
      } as const;
    }

    const quizArray =
      section === "starter-quiz"
        ? lessonContent.starterQuiz
        : lessonContent.exitQuiz;
    return {
      section,
      completed: !!sectionResults[section]?.isComplete,
      grade: sectionResults[section]?.grade ?? 0,
      numQuestions: sectionResults[section]?.numQuestions ?? 0,
      resultsSlot: (
        <QuizResults
          lessonSection={section}
          quizArray={quizArray}
          sectionResults={sectionResults}
          copyrightNotice={
            <CopyrightNotice
              isLegacyLicense={lessonContent.isLegacy ?? false}
            />
          }
        />
      ),
    } as const;
  });
};
