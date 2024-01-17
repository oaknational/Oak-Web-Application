import { ShortAnswers } from "./ShortAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { shortAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("Short Answers", () => {
  it("renders the answer", () => {
    const { getByText } = renderWithTheme(
      <ShortAnswers answers={shortAnswers} />,
    );
    expect(getByText("earth, wind, fire")).toBeInTheDocument();
  });
});
