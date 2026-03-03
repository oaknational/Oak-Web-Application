import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

export const sectionResultsFixture: LessonSectionResults = {
  intro: {
    worksheetDownloaded: false,
    worksheetAvailable: true,
    isComplete: true,
  },
  "starter-quiz": {
    grade: 2,
    numQuestions: 6,
    questionResults: [
      //shrt answer question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: "incorrect",
        pupilAnswer: "wqdqwedq",
        correctAnswer: ["reciprocal"],
      },
      // mcq question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: ["incorrect", "correct", "incorrect", "correct", "correct"],
        isPartiallyCorrect: false,
        pupilAnswer: [0],
        correctAnswer: ["$$7x \\times {1\\over 7} = 8\\times {1\\over 7}$$"],
      },
      //  match question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: [
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
        ],
        isPartiallyCorrect: false,
        pupilAnswer: ["5", "0", "4", "1", "3", "2"],
        correctAnswer: [
          "$$1\\over 2$$",
          "$$2$$",
          "$$2\\over 3$$",
          "$$-2$$",
          "$$-{3\\over 2}$$",
          "$$6$$",
        ],
      },
      // short answer
      {
        offerHint: false,
        grade: 1,
        mode: "feedback",
        feedback: "correct",
        pupilAnswer: "1",
        correctAnswer: ["1"],
      },
      // short answer question
      {
        offerHint: false,
        grade: 1,
        mode: "feedback",
        feedback: "correct",
        pupilAnswer: "2",
        correctAnswer: ["2"],
      },
      //match question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: [
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
          "incorrect",
        ],
        isPartiallyCorrect: false,
        pupilAnswer: ["5", "0", "3", "1", "2", "4"],
        correctAnswer: [
          "$$6x-12$$",
          "$$6x-6$$",
          "$$2x-12$$",
          "$$6x+12$$",
          "$$6x-18$$",
          "$$-6x+18$$",
        ],
      },
    ],
    isComplete: true,
  },
  video: {
    isComplete: true,
    played: true,
    duration: 0,
    timeElapsed: 0,
    muted: false,
    signedOpened: false,
    transcriptOpened: false,
  },
  "exit-quiz": {
    grade: 1,
    numQuestions: 6,
    questionResults: [
      //short answer
      {
        offerHint: false,
        grade: 1,
        mode: "feedback",
        feedback: "correct",
        pupilAnswer: "18",
        correctAnswer: ["18"],
      },
      //match question
      {
        offerHint: false,
        grade: 1,
        mode: "feedback",
        feedback: ["correct", "correct", "correct", "correct", "correct"],
        isPartiallyCorrect: false,
        pupilAnswer: ["0", "1", "2", "3", "4"],
        correctAnswer: [
          "$$a = 28$$",
          "$$a = 37$$",
          "$$a = {7\\over 4}$$",
          "$$a = 8$$",
          "$$a = 11$$",
        ],
      },
      //match question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: [
          "incorrect",
          "incorrect",
          "incorrect",
          "correct",
          "incorrect",
        ],
        isPartiallyCorrect: true,
        pupilAnswer: ["2", "0", "4", "3", "1"],
        correctAnswer: [
          "$$2x\\over 3$$",
          "$$2({1\\over 3x})$$",
          "$$2\\over 9x$$",
          "$$2x\\over 9$$",
          "$$3\\over 2x$$",
        ],
      },
      //short answer
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: "incorrect",
        pupilAnswer: "5",
        correctAnswer: ["3", ""],
      },
      // mcq question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: ["incorrect", "incorrect", "correct", "correct", "correct"],
        isPartiallyCorrect: false,
        pupilAnswer: [0],
        correctAnswer: ["$$2\\over 15$$"],
      },
      //mcq question
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: ["incorrect", "correct", "incorrect", "correct", "correct"],
        isPartiallyCorrect: false,
        pupilAnswer: [0],
        correctAnswer: ["$$1\\over 3$$"],
      },
      // order quesion
      {
        offerHint: false,
        grade: 0,
        mode: "feedback",
        feedback: ["correct", "correct", "correct", "correct"],
        // isPartiallyCorrect: true,
        pupilAnswer: [1, 4, 2, 3],
        correctAnswer: [
          "Edward the Confessor was exiled in Normandy.",
          "Edward the Confessor became king.",
          "Harold Godwinson travelled to Normandy.",
          "Edward the Confessor died.",
        ],
      },
    ],
    isComplete: true,
  },
};
