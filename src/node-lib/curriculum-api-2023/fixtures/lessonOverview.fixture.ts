import {
  LessonOverviewPageData,
  StemImageObject,
} from "../queries/lessonOverview/lessonOverview.schema";

const image_object: StemImageObject["image_object"] = {
  format: "jpg",
  url: "http://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  secure_url:
    "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
  width: 1280,
  height: 852,
  metadata: {},
  public_id: "Trees",
  version: 1687374653,
};

const lessonOverviewFixture = (
  partial?: Partial<LessonOverviewPageData>
): LessonOverviewPageData => {
  return {
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
    misconceptionsAndCommonMistakes: [{ response: "", misconception: "" }],
    lessonEquipmentAndResources: null,
    teacherTips: null,
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
    worksheetUrl: null,
    presentationUrl: null,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: null,
    starterQuiz: [
      {
        hint: "Main clause is the most powerful of the clauses.",
        active: false,
        questionStem: [
          {
            text: "What is a main clause?",
            type: "text",
          },
        ],
        answers: {
          "multiple-choice": [
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
                  text: "a word that joins",
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
          ],
        },
        feedback:
          "Correct! A main clause can form a simple sentence by itself.",
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
        questionStem: [
          {
            text: "Which of these statements about trees is true?",
            type: "text",
          },
          {
            type: "image",
            image_object,
          },
        ],
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
          ],
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
          match: [
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
          ],
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
          order: [
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
              answer: [
                { text: "Edward the Confessor became king.", type: "text" },
              ],
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
          ],
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
          "short-answer": [
            {
              answer: [{ text: "water", type: "text" }],
              answer_is_default: true,
            },
          ],
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
    ],
    exitQuiz: [
      {
        hint: "A subordinate clause is not as powerful as a main clause!",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "a group of words with no verb", type: "text" }],
              answer_is_correct: true,
            },
            {
              answer: [
                {
                  text: "a group of words that contains a verb and does not make complete sense",
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
              answer_is_correct: false,
            },
            {
              answer: [{ text: "a group of letters", type: "text" }],
              answer_is_correct: false,
            },
          ],
        },
        feedback: "Correct! A subordinate always contains a verb.",
        questionId: 991,
        questionUid: "QUES-LXXMB-NY991",
        questionStem: [
          { text: "What is a **subordinate clause**?", type: "text" },
        ],
        questionType: "multiple-choice",
      },
      {
        hint: "Subordinating conjunctions join the adverbial clause to the main clause.",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "starts", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "ends", type: "text" }],
              answer_is_correct: true,
            },
            {
              answer: [{ text: "breaks", type: "text" }],
              answer_is_correct: false,
            },
          ],
        },
        feedback:
          "Correct! Subordinating conjunctions are a type of conjunction.",
        questionId: 992,
        questionUid: "QUES-MQWJX-LS992",
        questionStem: [
          {
            text: "Fill in the gap: a subordinating conjunction is a word that _ an adverbial clause.",
            type: "text",
          },
        ],
        questionType: "multiple-choice",
      },
      {
        hint: "An adverbial clause must join to a main clause to make sense.",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "main", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "simple", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "subordinate", type: "text" }],
              answer_is_correct: true,
            },
          ],
        },
        feedback: "Correct! There are several types of subordinate clause.",
        questionId: 993,
        questionUid: "QUES-JFAVM-CZ993",
        questionStem: [
          {
            text: "Fill in the gap: an adverbial clause is a type of _ clause.",
            type: "text",
          },
        ],
        questionType: "multiple-choice",
      },
      {
        hint: "A compound sentence is formed of at least two main clauses.",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "simple", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "compound", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "complex", type: "text" }],
              answer_is_correct: true,
            },
          ],
        },
        feedback:
          "Correct! A subordinate clause must join to a main clause in any type of complex sentence.",
        questionId: 994,
        questionUid: "QUES-SNPZX-BK994",
        questionStem: [
          {
            text: "What type of sentence is formed of at least one main clause and a subordinate clause?",
            type: "text",
          },
        ],
        questionType: "multiple-choice",
      },
      {
        hint: "A subordinate clause does not make sense by itself.",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [
                {
                  text: "it is a group of words that contains a verb",
                  type: "text",
                },
              ],
              answer_is_correct: true,
            },
            {
              answer: [{ text: "it makes complete sense", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [
                {
                  text: "it can form a simple sentence by itself",
                  type: "text",
                },
              ],
              answer_is_correct: false,
            },
          ],
        },
        feedback:
          "Correct! Main clauses and subordinate clauses are both groups of words that contain verbs.",
        questionId: 995,
        questionUid: "QUES-OELML-QA995",
        questionStem: [
          {
            text: "What is one feature of a subordinate clause that is the **same** as a main clause?",
            type: "text",
          },
        ],
        questionType: "multiple-choice",
      },
      {
        hint: "Subordinating conjunctions join adverbial clauses to main clauses.",
        active: false,
        answers: {
          "multiple-choice": [
            {
              answer: [{ text: "and but", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "I me", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "you they", type: "text" }],
              answer_is_correct: false,
            },
            {
              answer: [{ text: "when because", type: "text" }],
              answer_is_correct: true,
            },
          ],
        },
        feedback:
          "Correct! A subordinating conjunction starts an adverbial clause.",
        questionId: 996,
        questionUid: "QUES-DELNG-VT996",
        questionStem: [
          {
            text: "Which of these pairs of words are **subordinating conjunctions**?",
            type: "text",
          },
        ],
        questionType: "multiple-choice",
      },
    ],
    ...partial,
  };
};

export default lessonOverviewFixture;
