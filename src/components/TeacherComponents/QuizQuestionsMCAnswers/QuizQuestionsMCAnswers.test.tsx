import { QuizQuestionsMCAnswers } from "./QuizQuestionsMCAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mcqImageAnswers,
  mcqTextAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

describe("QuizQuestionsMCAnswers", () => {
  it("renders the correct number of answers", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={mcqTextAnswers} questionNumber={0} />,
    );
    const answers = getAllByRole("listitem");

    expect(answers).toHaveLength(4);
  });

  it("renders the answer text", () => {
    const { getByText } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={mcqTextAnswers} questionNumber={0} />,
    );

    for (const answer of mcqTextAnswers) {
      if (!answer.answer[0]) {
        throw new Error("answer.answer[0] is null");
      }
      if (answer.answer[0].type === "image") {
        throw new Error("answer.answer[0].type is image");
      }

      const answerText = getByText(answer.answer[0].text);
      expect(answerText).toBeInTheDocument();
    }
  });

  it("highlights the correct answer", () => {
    const { getByText } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={mcqTextAnswers} questionNumber={0} />,
    );

    const correctAnswer: MCAnswer | undefined = mcqTextAnswers.find(
      (a) => a.answerIsCorrect,
    );

    if (!correctAnswer) throw new Error("correctAnswer is null");
    if (!correctAnswer.answer[0]) {
      throw new Error("correctAnswer.answer[0] is null");
    }
    if (correctAnswer.answer[0].type !== "text") {
      throw new Error("correctAnswer.answer[0] is not text");
    }

    const answerText = getByText(
      `Correct answer: ${correctAnswer.answer[0].text}`,
    );
    expect(answerText).toBeInTheDocument();
  });

  it("renders the image answers", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={mcqImageAnswers} questionNumber={0} />,
    );

    expect(getAllByRole("presentation")).toHaveLength(3);
  });

  it("uses image alt text when present on image object", () => {
    const answersWithAlt: MCAnswer[] = [
      {
        answer: [
          {
            type: "image",
            imageObject: {
              format: "jpg",
              secureUrl:
                "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
              metadata: [],
              alt: "A tree in a field",
            },
          },
        ],
        answerIsCorrect: true,
      },
    ];

    const { getByAltText } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={answersWithAlt} questionNumber={0} />,
    );

    expect(getByAltText("A tree in a field")).toBeInTheDocument();
  });

  it("uses a fallback alt text for image-only answers when alt is missing", () => {
    const answersWithoutAlt: MCAnswer[] = [
      {
        answer: [
          {
            type: "image",
            imageObject: {
              format: "jpg",
              secureUrl:
                "https://oaknationalacademy-res.cloudinary.com/image/upload/v1687374653/Trees.jpg",
              metadata: [],
              alt: undefined,
            },
          },
        ],
        answerIsCorrect: false,
      },
    ];

    const { getByAltText } = renderWithTheme(
      <QuizQuestionsMCAnswers answers={answersWithoutAlt} questionNumber={0} />,
    );

    expect(getByAltText("Answer image")).toBeInTheDocument();
  });
});
