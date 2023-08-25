import { MCAnswers } from "./MCAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mcqImageAnswers,
  mcqTextAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

describe("MCAnswers", () => {
  it("renders the correct number of answers", () => {
    const { getAllByRole } = renderWithTheme(
      <MCAnswers answers={mcqTextAnswers} questionNumber={0} />
    );
    const answers = getAllByRole("listitem");

    expect(answers.length).toBe(4);
  });

  it("renders the answer text", () => {
    const { getByText } = renderWithTheme(
      <MCAnswers answers={mcqTextAnswers} questionNumber={0} />
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
      <MCAnswers answers={mcqTextAnswers} questionNumber={0} />
    );

    const correctAnswer: MCAnswer | undefined = mcqTextAnswers.find(
      (a) => a.answer_is_correct
    );

    if (!correctAnswer) throw new Error("correctAnswer is null");
    if (!correctAnswer.answer[0]) {
      throw new Error("correctAnswer.answer[0] is null");
    }
    if (correctAnswer.answer[0].type !== "text") {
      throw new Error("correctAnswer.answer[0] is not text");
    }

    getByText(`Correct answer: ${correctAnswer.answer[0].text}`);
  });

  it("renders the image answers", () => {
    const { getAllByRole } = renderWithTheme(
      <MCAnswers answers={mcqImageAnswers} questionNumber={0} />
    );

    expect(getAllByRole("img").length).toBe(3);
  });
});
