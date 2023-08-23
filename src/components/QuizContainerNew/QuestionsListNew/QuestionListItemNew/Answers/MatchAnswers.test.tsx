import { MatchAnswers } from "./MatchAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { matchAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("Match Answers", () => {
  it("renders all the answers and options", () => {
    const { getAllByRole } = renderWithTheme(
      <MatchAnswers answers={matchAnswers} questionNumber={1} />
    );
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders the correct matches", () => {
    const { getAllByRole } = renderWithTheme(
      <MatchAnswers answers={matchAnswers} questionNumber={1} />
    );

    const items = getAllByRole("listitem");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const match_option = matchAnswers[i].match_option[0];
      const correct_choice = matchAnswers[i].correct_choice[0];
      expect(item).toHaveTextContent(match_option.text);
      expect(item).toHaveTextContent(correct_choice.text);
    }
  });
});
