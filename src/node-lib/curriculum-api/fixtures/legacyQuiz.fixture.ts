import { LegacyQuizData } from "../legacyQuiz.schema";

export const legacyQuizFixture = (partial?: LegacyQuizData[]) => {
  const q: LegacyQuizData[] = [
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "what is a question",
      points: 3,
      required: true,
      choices: [
        {
          choice: "this one",
          image:
            "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
        },
        { choice: "that one", image: null },
      ],
      active: true,
      answer: "this one",
      type: "multiple-choice",
      quizType: "intro",
      displayNumber: "Q1.",
      images: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
      feedbackCorrect: "weldone",
      feedbackIncorrect: "unluckey",
    },
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "what is a match question",
      points: 3,
      required: true,
      choices: [
        { choice: "A", image: null },
        { choice: "B", image: null },
        { choice: "C", image: null },
        { choice: "D", image: null },
      ],
      active: true,
      answer: ["a", "b", "c", "d"],
      type: "match",
      quizType: "intro",
      displayNumber: "Q2.",
      images: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
      feedbackCorrect: "weldone",
      feedbackIncorrect: "unluckey",
    },
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "what is a order question",
      points: 3,
      required: true,
      active: true,
      answer: ["a", "b", "c", "d"],
      type: "order",
      quizType: "intro",
      displayNumber: "Q3.",
      images: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
      feedbackCorrect: "weldone",
      feedbackIncorrect: "unluckey",
    },
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "what is a order question",
      points: 3,
      required: true,
      active: true,
      answer: ["a", "b", "c", "d"],
      type: "short-answer",
      quizType: "intro",
      displayNumber: "Q3.",
      images: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
      feedbackCorrect: "weldone",
      feedbackIncorrect: "unluckey",
    },
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "A helpful explanation",
      points: 3,
      required: true,
      active: true,
      type: "text",
      quizType: "intro",
    },
  ];

  if (partial) {
    q.push(...partial);
  }

  return q;
};
