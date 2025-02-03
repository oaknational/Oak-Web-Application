import LessonOverviewCommonMisconceptions from "./LessonOverviewCommonMisconceptions";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

vi.mock("better-react-mathjax", () => ({
  MathJax: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("LessonOverviewCommonMisconceptions component", () => {
  it("should render with correct heading", () => {
    const commonMisconceptions = [
      { misconception: "test misconception", response: "test response" },
    ];
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverviewCommonMisconceptions
        commonMisconceptions={commonMisconceptions}
      />,
    );
    const componentTitle = getByText("Common misconception");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with misconception and response", () => {
    const commonMisconceptions = [
      { misconception: "test misconception", response: "test response" },
    ];
    const { getByText } = renderWithTheme(
      <LessonOverviewCommonMisconceptions
        commonMisconceptions={commonMisconceptions}
      />,
    );
    const misconception = getByText("test misconception");
    const response = getByText("test response");

    expect(misconception).toBeInTheDocument();
    expect(response).toBeInTheDocument();
  });

  it("should render with null and non-null core content", () => {
    const commonMisconceptions = [
      { misconception: "test misconception", response: null },
    ];
    const { queryByText } = renderWithTheme(
      <LessonOverviewCommonMisconceptions
        commonMisconceptions={commonMisconceptions}
      />,
    );

    const misconception = queryByText("test misconception");
    expect(misconception).toBeInTheDocument();
  });
});
