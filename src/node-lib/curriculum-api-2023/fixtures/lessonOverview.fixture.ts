import { LessonOverviewPageData } from "../queries/lessonOverview/lessonOverview.schema";

import { quizQuestions } from "./quizElements.fixture";

const lessonOverviewFixture = (
  partial?: Partial<LessonOverviewPageData>,
): LessonOverviewPageData => {
  return {
    expired: false,
    isLegacy: true,
    unitTitle: "Simple, Compound and Adverbial Complex Sentences",
    programmeSlug: "english-primary-ks2",
    unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
    lessonSlug:
      "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
    lessonTitle: "Adverbial complex sentences",
    keyStageSlug: "ks2",
    keyStageTitle: "Key Stage 2",
    subjectSlug: "english",
    subjectTitle: "English",
    yearTitle: "Year 3",
    additionalMaterialUrl: "www.google.com",
    misconceptionsAndCommonMistakes: [{ response: "", misconception: "" }],
    lessonEquipmentAndResources: null,
    teacherTips: null,
    pathways: [],
    keyLearningPoints: [
      {
        keyLearningPoint:
          "A word that joins a second idea to a main clause in an adverbial complex sentence is called a subordinating conjunction.",
      },
      {
        keyLearningPoint:
          "A subordinating conjunction is the word that starts an adverbial clause.",
      },
      {
        keyLearningPoint:
          "A subordinate clause is a group of words that contains a verb and does not make complete sense.",
      },
      {
        keyLearningPoint:
          "An adverbial clause is a type of subordinate clause.",
      },
      {
        keyLearningPoint:
          "A main clause joined with any subordinate clause forms a complex sentence.",
      },
    ],
    pupilLessonOutcome:
      "You understand that a complex sentence is formed of at least one main clause and any type of subordinate clause.",
    lessonKeywords: [
      {
        keyword: "subordinating conjunction",
        description: "a word that starts an adverbial clause",
      },
      {
        keyword: "subordinate clause",
        description:
          "a group of words that contains a verb and does not make complete sense",
      },
      {
        keyword: "adverbial clause",
        description:
          "a type of subordinate clause that starts with a subordinating conjunction",
      },
      {
        keyword: "main clause",
        description:
          "a group of words that contains a verb and makes complete sense",
      },
      {
        keyword: "complex sentence",
        description:
          "a sentence formed of at least one main clause and a subordinate clause",
      },
    ],
    copyrightContent: null,
    contentGuidance: [],
    supervisionLevel: null,
    presentationUrl:
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp",
    isWorksheetLandscape: true,
    hasCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: ["this is a sentence", "this is another sentence"],
    starterQuiz: quizQuestions,
    exitQuiz: quizQuestions,
    geoRestricted: false,
    loginRequired: false,
    downloads: [
      { exists: true, type: "intro-quiz-answers" },
      { exists: true, type: "intro-quiz-questions" },
      { exists: true, type: "exit-quiz-answers" },
      { exists: true, type: "exit-quiz-questions" },
      { exists: true, type: "worksheet-pdf" },
      { exists: true, type: "worksheet-pptx" },
      { exists: true, type: "presentation" },
    ],
    updatedAt: "2024-09-29T14:00:00.000Z",
    ...partial,
  };
};

export default lessonOverviewFixture;
