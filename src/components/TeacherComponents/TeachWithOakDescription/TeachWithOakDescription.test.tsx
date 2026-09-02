import { TeachWithOakDescription } from "./TeachWithOakDescription";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("TeachWithOakDescription", () => {
  it("renders the main heading", () => {
    const { getByRole } = renderWithTheme(<TeachWithOakDescription />);

    expect(
      getByRole("heading", {
        level: 2,
        name: "There's a lot of thinking behind every Oak lesson",
      }),
    ).toBeInTheDocument();
  });

  it("renders the descriptive copy", () => {
    const { getByText } = renderWithTheme(<TeachWithOakDescription />);

    expect(
      getByText(/Structure is important for effective learning/),
    ).toBeInTheDocument();
    expect(
      getByText(/Every learning cycle is carefully structured/),
    ).toBeInTheDocument();
    expect(
      getByText(/They give you the tools to introduce new knowledge/),
    ).toBeInTheDocument();
  });

  it("renders the learning cycle stages in order", () => {
    const { getAllByRole } = renderWithTheme(<TeachWithOakDescription />);

    const stages = getAllByRole("heading", { level: 3 }).map(
      (heading) => heading.textContent,
    );

    expect(stages).toEqual([
      "Explanation",
      "Check for understanding",
      "Practice",
      "Feedback",
    ]);
  });

  it("renders a 'With' connector between paired learning cycle stages", () => {
    const { getAllByText } = renderWithTheme(<TeachWithOakDescription />);

    expect(getAllByText("With")).toHaveLength(2);
  });
});
