import {
  LessonOverviewQuizData,
  MCAnswer,
  MatchAnswer,
  OrderAnswer,
  ShortAnswer,
  StemImageObject,
  StemTextObject,
} from "../queries/lessonOverview/lessonOverview.schema";

export const image_object: StemImageObject["image_object"] = {
  format: "jpg",
  url: "http://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  secure_url:
    "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  width: 1280,
  height: 852,
  metadata: [],
  public_id: "Trees",
  version: 1687374653,
};

export const questionStem: (StemImageObject | StemTextObject)[] = [
  {
    text: "What is a main clause?",
    type: "text",
  },
];

export const questionStemWithImage: (StemImageObject | StemTextObject)[] = [
  {
    text: "Which of these statements about trees is true?",
    type: "text",
  },
  {
    type: "image",
    image_object,
  },
];

export const mcqTextAnswers: MCAnswer[] = [
  {
    answer: [
      {
        text: "a sentence starter followed by a comma",
        type: "text",
      },
    ],
    answer_is_correct: false,
  },
  {
    answer: [
      {
        text: "a group of letters",
        type: "text",
      },
    ],
    answer_is_correct: false,
  },
  {
    answer: [
      {
        text: "a group of words that contains a verb and makes complete sense",
        type: "text",
      },
    ],
    answer_is_correct: true,
  },
  {
    answer: [
      {
        text: "a word that joins",
        type: "text",
      },
    ],
    answer_is_correct: false,
  },
];

export const mcqImageAnswers: MCAnswer[] = [
  {
    answer: [
      {
        type: "image",
        image_object,
      },
      {
        text: "Trees grow from seeds.",
        type: "text",
      },
    ],
    answer_is_correct: true,
  },
  {
    answer: [
      {
        type: "image",
        image_object,
      },
      {
        text: "Trees grow from something different to seeds.",
        type: "text",
      },
    ],
    answer_is_correct: false,
  },
  {
    answer: [
      {
        type: "image",
        image_object,
      },
      {
        text: "Trees are put in the ground by people.",
        type: "text",
      },
    ],
    answer_is_correct: false,
  },
];

export const shortAnswers: ShortAnswer[] = [
  {
    answer: [{ text: "earth", type: "text" }],
    answer_is_default: true,
  },
  {
    answer: [{ text: "wind", type: "text" }],
    answer_is_default: false,
  },
  {
    answer: [{ text: "fire", type: "text" }],
    answer_is_default: false,
  },
];

export const orderAnswers: OrderAnswer[] = [
  {
    answer: [
      {
        text: "Edward the Confessor was exiled in Normandy.",
        type: "text",
      },
    ],
    correct_order: 1,
  },
  {
    answer: [{ text: "Edward the Confessor became king.", type: "text" }],
    correct_order: 2,
  },
  {
    answer: [
      {
        text: "Harold Godwinson travelled to Normandy.",
        type: "text",
      },
    ],
    correct_order: 3,
  },
  {
    answer: [{ text: "Edward the Confessor died.", type: "text" }],
    correct_order: 4,
  },
];

export const matchAnswers: MatchAnswer[] = [
  {
    correct_choice: [{ text: "producer", type: "text" }],
    match_option: [{ text: "grass", type: "text" }],
  },
  {
    correct_choice: [{ text: "primary consumer", type: "text" }],
    match_option: [{ text: "cow", type: "text" }],
  },
  {
    correct_choice: [{ text: "secondary consumer", type: "text" }],
    match_option: [{ text: "human", type: "text" }],
  },
];

export const quizQuestions: LessonOverviewQuizData = [
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
            },
          ],
          answer_is_correct: true,
        },
        {
          answer: [
            {
              text: "Trees grow from something different to seeds.",
              type: "text",
            },
          ],
          answer_is_correct: false,
        },
        {
          answer: [
            {
              text: "Trees are put in the ground by people.",
              type: "text",
            },
          ],
          answer_is_correct: false,
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
      },
    ],
    questionType: "short-answer",
  },
];
