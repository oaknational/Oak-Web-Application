import { describe, expect, it } from "vitest";

import { QuizQuestionsOrderAnswers } from "./QuizQuestionsOrderAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizQuestionsOrderAnswers", () => {
  it("renders all the answers", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsOrderAnswers answers={orderAnswers} questionNumber={1} />,
    );
    expect(getAllByRole("listitem")).toHaveLength(4);
  });

  it("renders all the answers in order", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsOrderAnswers answers={orderAnswers} questionNumber={1} />,
    );
    const elems = getAllByRole("listitem");

    expect(elems.length !== orderAnswers.length);

    for (let i = 0; i < elems.length; i++) {
      expect(elems[i]).toHaveTextContent(
        // @ts-expect-error : we know this data is populated
        `${i + 1} - ${orderAnswers[i].answer[0].text}`,
      );
    }
  });
});
