import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const useGetQuizTrackingData = () => {
  const { sectionResults } = useLessonEngineContext();

  const getQuizTrackingData = (section: "starter-quiz" | "exit-quiz") => ({
    pupilExperienceLessonActivity: section,
    pupilQuizGrade: sectionResults[section]?.grade || 0,
    pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
    // FIXME: these are still wrong. The full results should be sent
    hintQuestion: "",
    hintQuestionResult: "",
    hintUsed: "",
  });

  return {
    getQuizTrackingData,
  };
};
