import QuizImage from "./QuizImage";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { image_object } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("QuizImage", () => {
  it("should render", () => {
    const { getByRole } = renderWithTheme(<QuizImage src={image_object} />);
    expect(getByRole("img")).toBeInTheDocument();
  });

  it("constrains height to 200", () => {
    const { getByRole } = renderWithTheme(<QuizImage src={image_object} />);
    expect(getByRole("img")).toHaveAttribute("height", "200");
  });

  it("gets the natural dims when none are specified", () => {
    const no_dims = { ...image_object, width: undefined, height: undefined };
    const { getByRole } = renderWithTheme(<QuizImage src={no_dims} />);
    expect(getByRole("img")).toHaveAttribute("data-nimg", "fill");
  });
});
