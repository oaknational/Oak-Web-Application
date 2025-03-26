import { LessonDownloadsPageData } from "../queries/lessonDownloads/lessonDownloads.schema";

export const allResources: LessonDownloadsPageData["downloads"] = [
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

export const additionalFilesResources: LessonDownloadsPageData["additionalFiles"] =
  [
    {
      type: "additional-files",
      exists: true,
      label: "some file",
      ext: "PY",
      assetId: 123,
      size: 135657,
    },
    {
      type: "additional-files",
      exists: true,
      label: "some other file",
      ext: "PNG",
      assetId: 456,
      size: 46765645,
    },
  ];

export const noSlideDeck: LessonDownloadsPageData["downloads"] = [
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

export const oneWorksheet: LessonDownloadsPageData["downloads"] = [
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

export const noSlideDeckOneWorksheet: LessonDownloadsPageData["downloads"] = [
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
