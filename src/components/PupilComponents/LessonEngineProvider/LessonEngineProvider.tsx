import { ReactNode, createContext, useContext, memo, useState } from "react";

export const lessonSections = [
  "overview",
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
  "review",
] as const;

export const lessonReviewSections = [
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
] as const;

export type LessonSection = (typeof lessonSections)[number];

export const isLessonSection = (
  currentSection: string,
): currentSection is LessonSection => {
  return lessonSections.includes(currentSection as LessonSection);
};

export type LessonSectionResult = { grade: number; numQuestions: number };

type LessonSectionResults = Partial<Record<LessonSection, LessonSectionResult>>;

export type LessonEngineContextType = {
  currentSection: LessonSection;
  completedSections: LessonSection[];
  sectionResults: LessonSectionResults;
  getIsComplete: (section: LessonSection) => boolean;
  completeSection: (section: LessonSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
  proceedToNextSection: () => void;
  updateQuizResult: (vals: { grade: number; numQuestions: number }) => void;
} | null;

export const LessonEngineContext = createContext<LessonEngineContextType>(null);

export const useLessonEngineContext = () => {
  const context = useContext(LessonEngineContext);
  if (!context) {
    throw new Error("`LessonEngineProvider` is not available");
  }
  return context;
};

export const LessonEngineProvider = memo((props: { children: ReactNode }) => {
  // consolidate into a single stateful object
  const [currentSection, setCurrentSection] =
    useState<LessonSection>("overview");

  const [completedSections, setCompletedSections] = useState<LessonSection[]>(
    [],
  );

  const [sectionResults, setSectionResults] = useState<LessonSectionResults>(
    {},
  );

  const getIsComplete = (section: LessonSection) =>
    completedSections.includes(section);

  const completeSection = (section: LessonSection) => {
    // concatenate and dedupe the array
    setCompletedSections((prev) => {
      const _completedSections = [...prev, section].filter(
        (item, index, array) => array.indexOf(item) === index,
      );

      // redirect the user according to what sections have been completed
      if (
        _completedSections.length ===
        lessonSections.filter((s) => s !== "overview" && s !== "review").length
      ) {
        setCurrentSection("review");
      } else {
        setCurrentSection("overview");
      }

      return _completedSections;
    });
  };

  const updateCurrentSection = (section: LessonSection) => {
    setCurrentSection(section);
  };

  const proceedToNextSection = () => {
    const remainingSections = lessonSections.filter(
      (s) => !completedSections.includes(s) && s !== "overview",
    );
    if (remainingSections.length === 0 || remainingSections[0] === undefined) {
      // if there is no next section, we are at the end of the lesson
      return;
    }
    setCurrentSection(remainingSections[0]);
  };

  const updateQuizResult = (vals: { grade: number; numQuestions: number }) => {
    setSectionResults((prev) => ({ ...prev, [currentSection]: vals }));
  };

  return (
    <LessonEngineContext.Provider
      value={{
        currentSection,
        completedSections,
        sectionResults,
        getIsComplete,
        completeSection,
        updateCurrentSection,
        proceedToNextSection,
        updateQuizResult,
      }}
    >
      {props.children}
    </LessonEngineContext.Provider>
  );
});
