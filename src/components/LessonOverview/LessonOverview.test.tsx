import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonOverview from "./LessonOverview";

describe("LessonOverview component", () => {
  it("should render", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverview coreContent={[]} />
    );
    const coreConentTitle = getByText("Core content");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(coreConentTitle).toBeInTheDocument();
  });

  it("should render with multiple core content list", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverview coreContent={["test", "test2", "test3"]} />
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  it("should render with null and non-null core content", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonOverview coreContent={["test", null]} />
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
