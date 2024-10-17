import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const useGetQuizTrackingData = () => {
  const { sectionResults, timeStamp } = useLessonEngineContext();

  const getQuizTrackingData = (section: "starter-quiz" | "exit-quiz") => {
    const timeSpent = new Date().getTime() - timeStamp.time;
    return {
      pupilExperienceLessonActivity: section,
      pupilQuizGrade: sectionResults[section]?.grade || 0,
      pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
      // FIXME: these are still wrong. The full results should be sent
      hintQuestion: "",
      hintQuestionResult: "",
      hintUsed: "",
      activityTimeSpent: timeSpent,
    };
  };

  return {
    getQuizTrackingData,
  };
};
