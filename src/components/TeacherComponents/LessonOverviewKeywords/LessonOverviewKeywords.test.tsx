import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import LessonOverviewKeywords from "./LessonOverviewKeywords";

describe("LessonOverviewKeywords component", () => {
  const keyWordsData = [
    { keyword: "test1", description: "Description for test1" },
    { keyword: "test2", description: "Description for test2" },
  ];
  it("should render with correct title", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverviewKeywords keyWords={keyWordsData} />,
    );
    const componentTitle = getByText("Keywords");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with multiple core content list", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverviewKeywords keyWords={keyWordsData} />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should render with null and non-null core content", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverviewKeywords
        keyWords={[{ keyword: "test1", description: null }]}
      />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
