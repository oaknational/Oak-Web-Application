import { describe, expect, it } from "vitest";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import LessonOverviewKeyLearningPoints from "./LessonOverviewKeyLearningPoints";

describe("LessonOverviewKeyLearningPoints component", () => {
  it("should render", () => {
    const keyLearningPoints = [{ keyLearningPoint: "test" }];
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverviewKeyLearningPoints keyLearningPoints={keyLearningPoints} />,
    );
    const componentTitle = getByText("Key learning points");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with multiple core content list", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverviewKeyLearningPoints
        keyLearningPoints={[
          { keyLearningPoint: "test" },
          { keyLearningPoint: "test 2" },
          { keyLearningPoint: "test 3" },
        ]}
      />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  it("should render with null and non-null core content", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverviewKeyLearningPoints
        keyLearningPoints={[
          { keyLearningPoint: "test" },
          { keyLearningPoint: null },
        ]}
      />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
