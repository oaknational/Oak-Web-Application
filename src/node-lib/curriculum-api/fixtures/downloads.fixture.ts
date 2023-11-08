import { LessonDownloadsData } from "@/node-lib/curriculum-api";

export const allResources: LessonDownloadsData["downloads"] = [
  {
    exists: true,
    type: "presentation",
    label: "Slide deck",
    ext: "pptx",
    forbidden: null,
  },
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pdf",
    label: "Worksheet",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pptx",
    label: "Worksheet",
    ext: "pptx",
  },
  {
    exists: false,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
  },
  {
    exists: false,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
  },
];

export const noSlideDeck: LessonDownloadsData["downloads"] = [
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pdf",
    label: "Worksheet",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pptx",
    label: "Worksheet",
    ext: "pptx",
  },
  {
    exists: false,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
  },
  {
    exists: false,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
  },
];

export const oneWorksheet: LessonDownloadsData["downloads"] = [
  {
    exists: true,
    type: "presentation",
    label: "Slide deck",
    ext: "pptx",
    forbidden: null,
  },
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pptx",
    label: "Worksheet",
    ext: "pdf",
  },
  {
    exists: false,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
  },
  {
    exists: false,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
  },
];

export const noSlideDeckOneWorksheet: LessonDownloadsData["downloads"] = [
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pdf",
    label: "Worksheet",
    ext: "pptx",
  },
  {
    exists: false,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
  },
  {
    exists: false,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
  },
];
