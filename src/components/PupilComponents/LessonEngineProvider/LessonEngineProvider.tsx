import { ReactNode, createContext, useContext, memo, useState } from "react";

const lessonSections = [
  "overview",
  "intro",
  "starter-quiz",
  "exit-quiz",
  "video",
  "review",
] as const;

export type LessonSection = (typeof lessonSections)[number];

export type LessonEngineContextType = {
  currentSection: LessonSection;
  completedSections: LessonSection[];
  getIsComplete: (section: LessonSection) => boolean;
  completeSection: (section: LessonSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
  proceedToNextSection: () => void;
} | null;

export const LessonEngineContext = createContext<LessonEngineContextType>(null);

export const useLessonEngineContext = () => {
  const context = useContext(LessonEngineContext);
  if (!context) {
    throw new Error("`QuizEngineProvider` is not available");
  }
  return context;
};

export const LessonEngineProvider = memo((props: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] =
    useState<LessonSection>("overview");

  const [completedSections, setCompletedSections] = useState<LessonSection[]>(
    [],
  );

  const getIsComplete = (section: LessonSection) =>
    completedSections.includes(section);

  const completeSection = (section: LessonSection) => {
    // concatenate and dedupe the array
    const newCompletedSections = [...completedSections, section].filter(
      (item, index, array) => array.indexOf(item) === index,
    );
    setCompletedSections(newCompletedSections);
  };

  const updateCurrentSection = (section: LessonSection) => {
    setCurrentSection(section);
  };

  const proceedToNextSection = () => {
    const currentIndex = lessonSections.indexOf(currentSection);
    const nextIndex = currentIndex + 1;
    const nextSection = lessonSections[nextIndex];
    if (!nextSection) {
      // if there is no next section, we are at the end of the lesson
      return;
    }
    setCurrentSection(nextSection);
  };

  return (
    <LessonEngineContext.Provider
      value={{
        currentSection,
        completedSections,
        getIsComplete,
        completeSection,
        updateCurrentSection,
        proceedToNextSection,
      }}
    >
      {props.children}
    </LessonEngineContext.Provider>
  );
});
