import { QuizQuestionsMatchAnswers } from "./QuizQuestionsMatchAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { matchAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizQuestionsMatchAnswers", () => {
  it("renders all the answers and options", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsMatchAnswers answers={matchAnswers} questionNumber={1} />,
    );
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders the correct matches", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizQuestionsMatchAnswers answers={matchAnswers} questionNumber={1} />,
    );

    const items = getAllByRole("listitem");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const t = matchAnswers[i];

      if (
        !t?.correct_choice ||
        !t?.match_option ||
        !t?.correct_choice[0] ||
        !t?.match_option[0]
      ) {
        throw new Error("Invalid test data");
      }

      const match_option = t.match_option[0];
      const correct_choice = t.correct_choice[0];

      expect(item).toHaveTextContent(match_option.text);
      expect(item).toHaveTextContent(correct_choice.text);
    }
  });
});
