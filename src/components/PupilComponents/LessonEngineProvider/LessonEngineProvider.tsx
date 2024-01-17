import { ReactNode, createContext, useContext, memo, useState } from "react";

import { useStateCallback } from "@/hooks/useStateCallback";

export const lessonSections = [
  "overview",
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
  "review",
] as const;

export type LessonSection = (typeof lessonSections)[number];

export const isLessonSection = (
  currentSection: string,
): currentSection is LessonSection => {
  return lessonSections.includes(currentSection as LessonSection);
};

export type LessonSectionResult = { grade: number; maxScore: number };

type LessonSectionResults = Partial<Record<LessonSection, LessonSectionResult>>;

export type LessonEngineContextType = {
  currentSection: LessonSection;
  completedSections: LessonSection[];
  sectionResults: LessonSectionResults;
  getIsComplete: (section: LessonSection) => boolean;
  completeSection: (section: LessonSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
  proceedToNextSection: () => void;
  updateQuizResult: (vals: { grade: number; maxScore: number }) => void;
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

  const [completedSections, setCompletedSections] = useStateCallback<
    LessonSection[]
  >([]);

  const [sectionResults, setSectionResults] = useState<LessonSectionResults>(
    {},
  );

  const getIsComplete = (section: LessonSection) =>
    completedSections.includes(section);

  const completeSection = (section: LessonSection) => {
    // concatenate and dedupe the array
    setCompletedSections(
      (prev) =>
        [...prev, section].filter(
          (item, index, array) => array.indexOf(item) === index,
        ),
      (_completedSections) => {
        if (
          _completedSections.length ===
          lessonSections.filter((s) => s !== "overview" && s !== "review")
            .length
        ) {
          setCurrentSection("review");
        } else setCurrentSection("overview");
      },
    );
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

  const updateQuizResult = (vals: { grade: number; maxScore: number }) => {
    setSectionResults((prev) => {
      const newSectionResults = { ...prev };
      newSectionResults[currentSection] = vals;
      return newSectionResults;
    });
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
