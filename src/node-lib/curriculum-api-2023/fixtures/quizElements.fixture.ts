import {
  StemImageObject,
  StemTextObject,
  MCAnswer,
  ShortAnswer,
  OrderAnswer,
  MatchAnswer,
  LessonOverviewQuizData,
} from "../shared.schema";

import { stemToPortableText } from "@/components/SharedComponents/Stem";

export const imageObject: StemImageObject["imageObject"] = {
  format: "jpg",
  url: "http://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  secureUrl:
    "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  width: 1280,
  height: 852,
  metadata: { attribution: "test attribution picture" },
  publicId: "Trees",
  version: 1687374653,
};

export const questionStem: (StemImageObject | StemTextObject)[] = [
  {
    text: "What is a main clause?",
    type: "text",
    portableText: stemToPortableText("What is a main clause?"),
  },
];

export const questionStemWithImage: (StemImageObject | StemTextObject)[] = [
  {
    text: "Which of these statements about trees is true?",
    type: "text",
    portabletext: stemToPortableText(
      "Which of these statements about trees is true?",
    ),
  },
  {
    type: "image",
    imageObject,
  },
];

export const mcqCorrectAnswer: MCAnswer = {
  answer: [
    {
      text: "a group of words that contains a verb and makes complete sense",
      type: "text",
      portabletext: stemToPortableText(
        "a group of words that contains a verb and makes complete sense",
      ),
    },
  ],
  answerIsCorrect: true,
};

export const mcqIncorrectAnswer: MCAnswer = {
  answer: [
    {
      text: "a sentence starter followed by a comma",
      type: "text",
      portabletext: stemToPortableText(
        "a sentence starter followed by a comma",
      ),
    },
  ],
  answerIsCorrect: false,
};

export const mcqTextAnswers: MCAnswer[] = [
  mcqIncorrectAnswer,
  {
    answer: [
      {
        text: "a group of letters",
        type: "text",
        portabletext: stemToPortableText("a group of letters"),
      },
    ],
    answerIsCorrect: false,
  },
  mcqCorrectAnswer,
  {
    answer: [
      {
        text: "a word that joins",
        type: "text",
        portabletext: stemToPortableText("a word that joins"),
      },
    ],
    answerIsCorrect: false,
  },
];

export const mcqImageAnswers: MCAnswer[] = [
  {
    answer: [
      {
        type: "image",
        imageObject,
      },
      {
        text: "Trees grow from seeds.",
        type: "text",
        portabletext: stemToPortableText("Trees grow from seeds."),
      },
    ],
    answerIsCorrect: true,
  },
  {
    answer: [
      {
        type: "image",
        imageObject,
      },
      {
        text: "Trees grow from something different to seeds.",
        type: "text",
        portabletext: stemToPortableText(
          "Trees grow from something different to seeds.",
        ),
      },
    ],
    answerIsCorrect: false,
  },
  {
    answer: [
      {
        type: "image",
        imageObject,
      },
      {
        text: "Trees are put in the ground by people.",
        type: "text",
        portabletext: stemToPortableText(
          "Trees are put in the ground by people.",
        ),
      },
    ],
    answerIsCorrect: false,
  },
];

export const shortAnswers: ShortAnswer[] = [
  {
    answer: [
      {
        text: "earth",
        type: "text",
        portableText: stemToPortableText("earth"),
      },
    ],
    answerIsDefault: true,
  },
  {
    answer: [
      { text: "wind", type: "text", portableText: stemToPortableText("wind") },
    ],
    answerIsDefault: false,
  },
  {
    answer: [
      { text: "fire", type: "text", portableText: stemToPortableText("fire") },
    ],
    answerIsDefault: false,
  },
];

export const orderAnswers: OrderAnswer[] = [
  {
    answer: [
      {
        text: "Edward the Confessor was exiled in Normandy.",
        type: "text",
        portabletext: stemToPortableText(
          "Edward the Confessor was exiled in Normandy.",
        ),
      },
    ],
    correctOrder: 1,
  },
  {
    answer: [
      {
        text: "Edward the Confessor became king.",
        type: "text",
        portableText: stemToPortableText("Edward the Confessor became king."),
      },
    ],
    correctOrder: 2,
  },
  {
    answer: [
      {
        text: "Harold Godwinson travelled to Normandy.",
        type: "text",
        portabletext: stemToPortableText(
          "Harold Godwinson travelled to Normandy.",
        ),
      },
    ],
    correctOrder: 3,
  },
  {
    answer: [
      {
        text: "Edward the Confessor died.",
        type: "text",
        portableText: stemToPortableText("Edward the Confessor died."),
      },
    ],
    correctOrder: 4,
  },
];

export const matchAnswers: MatchAnswer[] = [
  {
    correctChoice: [
      {
        text: "producer",
        type: "text",
        portableText: stemToPortableText("producer"),
      },
    ],
    matchOption: [
      {
        text: "grass",
        type: "text",
        portableText: stemToPortableText("grass"),
      },
    ],
  },
  {
    correctChoice: [
      {
        text: "primary consumer",
        type: "text",
        portableText: stemToPortableText("primary consumer"),
      },
    ],
    matchOption: [
      { text: "cow", type: "text", portableText: stemToPortableText("cow") },
    ],
  },
  {
    correctChoice: [
      {
        text: "secondary consumer",
        type: "text",
        portableText: stemToPortableText("secondary consumer"),
      },
    ],
    matchOption: [
      {
        text: "human",
        type: "text",
        portableText: stemToPortableText("human"),
      },
    ],
  },
];

export const quizQuestions: NonNullable<LessonOverviewQuizData> = [
  {
    hint: "Main clause is the most powerful of the clauses.",
    active: false,
    questionStem,
    answers: {
      "multiple-choice": mcqTextAnswers,
    },
    feedback: "Correct! A main clause can form a simple sentence by itself.",
    questionId: 985,
    questionUid: "QUES-EKUYT-EE985",

    questionType: "multiple-choice",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    answers: {
      "multiple-choice": [
        {
          answer: [
            {
              text: "Trees grow from seeds.",
              type: "text",
              portabletext: stemToPortableText("Trees grow from seeds."),
            },
          ],
          answerIsCorrect: true,
        },
        {
          answer: [
            {
              text: "Trees grow from something different to seeds.",
              type: "text",
              portabletext: stemToPortableText(
                "Trees grow from something different to seeds.",
              ),
            },
          ],
          answerIsCorrect: false,
        },
        {
          answer: [
            {
              text: "Trees are put in the ground by people.",
              type: "text",
              portabletext: stemToPortableText(
                "Trees are put in the ground by people.",
              ),
            },
          ],
          answerIsCorrect: false,
        },
      ],
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",
    questionStem: questionStemWithImage,
    questionType: "multiple-choice",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    answers: {
      "multiple-choice": mcqImageAnswers,
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",
    questionStem: [
      {
        text: "Which of these statements about trees is true?",
        type: "text",
        portabletext: stemToPortableText(
          "Which of these statements about trees is true?",
        ),
      },
    ],
    questionType: "multiple-choice",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    answers: {
      match: matchAnswers,
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",
    questionStem: [
      {
        text: "Match each organism from the food chain to the correct term used to describe it.",
        type: "text",
        portabletext: stemToPortableText(
          "Match each organism from the food chain to the correct term used to describe it.",
        ),
      },
    ],
    questionType: "match",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    questionStem: [
      {
        text: "Put the following events in the order in which they happened, according to William of Poitiers. Start with the earliest event.",
        type: "text",
        portabletext: stemToPortableText(
          "Put the following events in the order in which they happened, according to William of Poitiers. Start with the earliest event.",
        ),
      },
    ],
    answers: {
      order: orderAnswers,
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",

    questionType: "order",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    answers: {
      "short-answer": shortAnswers,
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",
    questionStem: [
      {
        text: "When the roots push out of the seed, they grow down into the soil 'searching' for {{}}.",
        type: "text",
        portabletext: stemToPortableText(
          "When the roots push out of the seed, they grow down into the soil 'searching' for {{}}.",
        ),
      },
    ],
    questionType: "short-answer",
  },
];

export const quizQuestionsNoImages: LessonOverviewQuizData = [
  {
    hint: "Main clause is the most powerful of the clauses.",
    active: false,
    questionStem,
    answers: {
      "multiple-choice": mcqTextAnswers,
    },
    feedback: "Correct! A main clause can form a simple sentence by itself.",
    questionId: 985,
    questionUid: "QUES-EKUYT-EE985",

    questionType: "multiple-choice",
  },
  {
    hint: "A Horse chestnut tree grows from a conker.",
    active: false,
    answers: {
      "short-answer": shortAnswers,
    },
    feedback: "Correct! Trees do grow from seeds.",
    questionId: 20,
    questionUid: "QUES-CKPSN-KFF20",
    questionStem: [
      {
        text: "When the roots push out of the seed, they grow down into the soil 'searching' for {{}}.",
        type: "text",
        portabletext: stemToPortableText(
          "When the roots push out of the seed, they grow down into the soil 'searching' for {{}}.",
        ),
      },
    ],
    questionType: "short-answer",
  },
];
