import { screen } from "@testing-library/react";

import HeaderMetadata from "./LessonMetadata";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HeaderMetadata", () => {
  it("renders year and examboard when passed in", () => {
    renderWithTheme(
      <HeaderMetadata yearTitle={"Year 5"} examBoardTitle={"AQA"} />,
    );
    const yearTitle = screen.getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const examBoardTitle = screen.getByText("AQA");
    expect(examBoardTitle).toBeInTheDocument();
  });
  it("renders year and tier when passed in", () => {
    renderWithTheme(
      <HeaderMetadata yearTitle={"Year 5"} tierTitle={"Foundation"} />,
    );
    const yearTitle = screen.getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const tierTitle = screen.getByText("Foundation");
    expect(tierTitle).toBeInTheDocument();
  });
  it("separates year, exam board and tier with a divider only between elements", () => {
    renderWithTheme(
      <HeaderMetadata
        yearTitle={"Year 5"}
        tierTitle={"Foundation"}
        examBoardTitle={"AQA"}
      />,
    );
    const dividers = screen.getAllByText("•");
    expect(dividers).toHaveLength(2);
  });
});
