import HeaderMetadata from "./LessonMetadata";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HeaderMetadata", () => {
  it("renders year and examboard when passed in", () => {
    const { getByText } = renderWithTheme(
      <HeaderMetadata yearTitle={"Year 5"} examBoardTitle={"AQA"} />,
    );
    const yearTitle = getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const examBoardTitle = getByText("AQA");
    expect(examBoardTitle).toBeInTheDocument();
  });
  it("renders year and tier when passed in", () => {
    const { getByText } = renderWithTheme(
      <HeaderMetadata yearTitle={"Year 5"} tierTitle={"Foundation"} />,
    );
    const yearTitle = getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const tierTitle = getByText("Foundation");
    expect(tierTitle).toBeInTheDocument();
  });
  it("separates year, exam board and tier with a divider only between elements", () => {
    const { getAllByText } = renderWithTheme(
      <HeaderMetadata
        yearTitle={"Year 5"}
        tierTitle={"Foundation"}
        examBoardTitle={"AQA"}
      />,
    );
    const dividers = getAllByText("•");
    expect(dividers).toHaveLength(2);
  });
});
