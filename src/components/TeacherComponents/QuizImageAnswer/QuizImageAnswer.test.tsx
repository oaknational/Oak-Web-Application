import QuizImageAnswer from "./QuizImageAnswer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { imageObject } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizImageAnswer", () => {
  it("should render", () => {
    const { getByRole } = renderWithTheme(
      <QuizImageAnswer src={imageObject} />,
    );
    expect(getByRole("presentation")).toBeInTheDocument();
  });

  it("constrains height to 200", () => {
    const { getByRole } = renderWithTheme(
      <QuizImageAnswer src={imageObject} />,
    );
    expect(getByRole("presentation")).toHaveAttribute("height", "200");
  });

  it("gets the natural dims when none are specified", () => {
    const no_dims = { ...imageObject, width: undefined, height: undefined };
    const { getByRole } = renderWithTheme(<QuizImageAnswer src={no_dims} />);
    expect(getByRole("presentation")).toHaveAttribute("data-nimg", "fill");
  });
  it("renders a tick when the answer is correct", () => {
    const no_dims = { ...imageObject, width: undefined, height: undefined };
    const { getByTestId } = renderWithTheme(
      <QuizImageAnswer src={no_dims} answerIsCorrect={true} />,
    );
    expect(getByTestId("answer-tick")).toBeInTheDocument();
  });
  it("doesn't render a tick when the answer is incorrect", () => {
    const no_dims = { ...imageObject, width: undefined, height: undefined };
    const { queryByTestId } = renderWithTheme(
      <QuizImageAnswer src={no_dims} answerIsCorrect={false} />,
    );
    expect(queryByTestId("answer-tick")).not.toBeInTheDocument();
  });
});
