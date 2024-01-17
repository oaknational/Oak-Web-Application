import { QuizQuestionsShortAnswers } from "./QuizQuestionsShortAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { shortAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizQuestionsShortAnswers", () => {
  it("renders the answer", () => {
    const { getByText } = renderWithTheme(
      <QuizQuestionsShortAnswers answers={shortAnswers} />,
    );
    expect(getByText("earth, wind, fire")).toBeInTheDocument();
  });
});
