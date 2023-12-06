import LessonMetadata from "./LessonMetadata";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonMetadata", () => {
  it("renders year and examboard when passed in", () => {
    const { getByText } = renderWithTheme(
      <LessonMetadata yearTitle={"Year 5"} examBoardTitle={"AQA"} />,
    );
    const yearTitle = getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const examBoardTitle = getByText("AQA");
    expect(examBoardTitle).toBeInTheDocument();
  });
  it("renders year and tier when passed in", () => {
    const { getByText } = renderWithTheme(
      <LessonMetadata yearTitle={"Year 5"} tierTitle={"Foundation"} />,
    );
    const yearTitle = getByText("Year 5");
    expect(yearTitle).toBeInTheDocument();
    const tierTitle = getByText("Foundation");
    expect(tierTitle).toBeInTheDocument();
  });
  it("separates year, exam board and tier with a divider only between elements", () => {
    const { getAllByText } = renderWithTheme(
      <LessonMetadata
        yearTitle={"Year 5"}
        tierTitle={"Foundation"}
        examBoardTitle={"AQA"}
      />,
    );
    const dividers = getAllByText("•");
    expect(dividers).toHaveLength(2);
  });
  it("renders a custom array of meta elements", () => {
    const { getAllByText, getByText } = renderWithTheme(
      <LessonMetadata metadataArray={["Year 5", "Foundation", "AQA"]} />,
    );
    const dividers = getAllByText("•");
    expect(dividers).toHaveLength(2);
    const tierTitle = getByText("Foundation");
    expect(tierTitle).toBeInTheDocument();
    const year = getByText("Year 5");
    expect(year).toBeInTheDocument();
    const examBoard = getByText("AQA");
    expect(examBoard).toBeInTheDocument();
  });
});
