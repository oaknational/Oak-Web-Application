import QuizImage from "./QuizImage";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { imageObject } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizImage", () => {
  it("should render", () => {
    const { getByRole } = renderWithTheme(<QuizImage src={imageObject} />);
    expect(getByRole("presentation")).toBeInTheDocument();
  });

  it("constrains height to 200", () => {
    const { getByRole } = renderWithTheme(<QuizImage src={imageObject} />);
    expect(getByRole("presentation", { hidden: true })).toHaveAttribute(
      "height",
      "200",
    );
  });

  it("gets the natural dims when none are specified", () => {
    const no_dims = { ...imageObject, width: undefined, height: undefined };
    const { getByRole } = renderWithTheme(<QuizImage src={no_dims} />);
    expect(getByRole("presentation")).toHaveAttribute("data-nimg", "fill");
  });
});
