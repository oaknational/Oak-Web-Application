import { getGroupName, groupDownloadResources } from "./groupResources"; // Assuming your file is named groupHelpers.ts

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

// Helper types for mock data, mirroring your setup
type Download = LessonDownloadsPageData["downloads"][number];
type AdditionalFile = LessonDownloadsPageData["additionalFiles"][number];

describe("groupHelpers", () => {
  describe("getGroupName", () => {
    it("should return 'Slide deck' for presentation and lesson-guide", () => {
      expect(getGroupName("presentation")).toBe("Slide deck");
      expect(getGroupName("lesson-guide-pdf")).toBe("Slide deck");
    });

    it("should return 'Quizzes' for quiz types", () => {
      expect(getGroupName("intro-quiz-questions")).toBe("Quizzes");
      expect(getGroupName("intro-quiz-answers")).toBe("Quizzes");
      expect(getGroupName("exit-quiz-questions")).toBe("Quizzes");
      expect(getGroupName("exit-quiz-answers")).toBe("Quizzes");
    });

    it("should return 'Worksheet' for worksheet types", () => {
      expect(getGroupName("worksheet-pdf")).toBe("Worksheet");
      expect(getGroupName("worksheet-pptx")).toBe("Worksheet");
    });

    it("should return 'Additional material' for supplementary types", () => {
      expect(getGroupName("supplementary-pdf")).toBe("Additional material");
      expect(getGroupName("supplementary-docx")).toBe("Additional material");
    });

    it("should return 'Lesson files' for curriculum, video, additional-files, and unclassified types", () => {
      expect(getGroupName("curriculum-pdf")).toBe("Lesson files");
      expect(getGroupName("additional-files")).toBe("Lesson files");
      // For any other type not explicitly listed, it should default to "Lesson files"
      expect(getGroupName("some-other-type" as Download["type"])).toBe(
        "Lesson files",
      );
    });
  });

  describe("groupDownloadResources", () => {
    const mockPresentation: Download = {
      type: "presentation",
      label: "Pres",
      ext: "pptx",
      exists: true,
    };
    const mockLessonGuide: Download = {
      type: "lesson-guide-pdf",
      label: "Guide",
      ext: "pdf",
      exists: true,
    };
    const mockIntroQuiz: Download = {
      type: "intro-quiz-questions",
      label: "Quiz",
      ext: "pdf",
      exists: true,
    };
    const mockIntroQuizAnswers: Download = {
      type: "intro-quiz-answers",
      label: "QuizA",
      ext: "pdf",
      exists: true,
    };
    const mockExitQuiz: Download = {
      type: "exit-quiz-questions",
      label: "QuizE",
      ext: "pdf",
      exists: true,
    };
    const mockExitQuizAnswers: Download = {
      type: "exit-quiz-answers",
      label: "QuizEA",
      ext: "pdf",
      exists: true,
    };
    const mockWorksheet: Download = {
      type: "worksheet-pdf",
      label: "Work",
      ext: "pdf",
      exists: true,
    };
    const mockWorksheetPptx: Download = {
      type: "worksheet-pptx",
      label: "WorkP",
      ext: "pptx",
      exists: true,
    };
    const mockSupplementaryPdf: Download = {
      type: "supplementary-pdf",
      label: "SuppP",
      ext: "pdf",
      exists: true,
    };
    const mockSupplementaryDocx: Download = {
      type: "supplementary-docx",
      label: "SuppD",
      ext: "docx",
      exists: true,
    };
    const mockCurriculumPdf: Download = {
      type: "curriculum-pdf",
      label: "Curr",
      ext: "pdf",
      exists: true,
    };
    const mockAdditionalFiles: Download = {
      type: "additional-files",
      label: "Add",
      ext: "pdf",
      exists: true,
    };
    const mockAdditionalFile: AdditionalFile = {
      type: "additional-files",
      label: "AddA",
      ext: "pdf",
      exists: true,
      assetId: 1,
      size: 2048,
    };

    it("should group files in correct groups", () => {
      const downloads: Download[] = [
        mockPresentation,
        mockLessonGuide,
        mockIntroQuiz,
        mockIntroQuizAnswers,
        mockExitQuiz,
        mockExitQuizAnswers,
        mockWorksheet,
        mockWorksheetPptx,
        mockSupplementaryPdf,
        mockSupplementaryDocx,
        mockCurriculumPdf,
        mockAdditionalFiles,
      ];
      const additionalFiles: AdditionalFile[] = [mockAdditionalFile];

      const grouped = groupDownloadResources(downloads, additionalFiles);

      expect(grouped["Slide deck"]).toEqual([
        mockPresentation,
        mockLessonGuide,
      ]);
      expect(grouped["Quizzes"]).toEqual([
        mockIntroQuiz,
        mockIntroQuizAnswers,
        mockExitQuiz,
        mockExitQuizAnswers,
      ]);
      expect(grouped["Worksheet"]).toEqual([mockWorksheet, mockWorksheetPptx]);
      expect(grouped["Additional material"]).toEqual([
        mockSupplementaryPdf,
        mockSupplementaryDocx,
      ]);
      expect(grouped["Lesson files"]).toEqual([
        mockCurriculumPdf,
        mockAdditionalFiles,
        mockAdditionalFile,
      ]);
      expect(Object.keys(grouped).length).toBe(5);
    });

    it("should only include groups for present file types", () => {
      const downloads: Download[] = [
        mockPresentation,
        mockIntroQuiz,
        mockWorksheet,
      ];
      const additionalFiles: AdditionalFile[] = [];

      const grouped = groupDownloadResources(downloads, additionalFiles);

      expect(grouped["Slide deck"]).toEqual([mockPresentation]);
      expect(grouped["Quizzes"]).toEqual([mockIntroQuiz]);
      expect(grouped["Worksheet"]).toEqual([mockWorksheet]);
      expect(Object.keys(grouped).length).toBe(3);
    });

    it("should return an empty object for empty or undefined inputs", () => {
      expect(groupDownloadResources([], [])).toEqual({});
      expect(groupDownloadResources(undefined, undefined)).toEqual({});
      expect(groupDownloadResources([], undefined)).toEqual({});
      expect(groupDownloadResources(undefined, [])).toEqual({});
    });
  });
});
