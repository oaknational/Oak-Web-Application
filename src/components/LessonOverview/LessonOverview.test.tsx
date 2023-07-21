import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonOverview from "./LessonOverview";

describe("LessonOverview component", () => {
  it("should render", () => {
    const keyLearningPoints = [{ keyLearningPoint: "test" }];
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverview keyLearningPoints={keyLearningPoints} />
    );
    const componentTitle = getByText("Key learning points");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with multiple core content list", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverview
        keyLearningPoints={[
          { keyLearningPoint: "test" },
          { keyLearningPoint: "test 2" },
          { keyLearningPoint: "test 3" },
        ]}
      />
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  it("should render with null and non-null core content", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverview
        keyLearningPoints={[
          { keyLearningPoint: "test" },
          { keyLearningPoint: null },
        ]}
      />
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
