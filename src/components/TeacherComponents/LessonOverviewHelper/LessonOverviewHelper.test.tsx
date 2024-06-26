import LessonOverviewHelper from "./LessonOverviewHelper";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonOverviewHelper component", () => {
  const equipment = [{ equipment: "test scissors" }];
  const contentGuidance = [
    {
      contentGuidanceLabel: "test label",
      contentGuidanceArea: "test area",
      contentGuidanceDescription: "test details",
    },
  ];
  const supervisionLevel = "test supervision level";

  it("it should render titles equipment title for Lesson Equipment component", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );

    const equipmentTitle = getByText("Equipment");
    expect(equipmentTitle).toBeInTheDocument();
  });

  it("should not render equipment if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={null}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );

    const equipmentTitle = queryByText("Equipment");
    expect(equipmentTitle).not.toBeInTheDocument();
  });

  it("it should render content guidance title for Lesson Equipment component", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );
    const contentGuidanceTitle = getByText("Content guidance");
    expect(contentGuidanceTitle).toBeInTheDocument();
  });

  it("should not render content guidance if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={equipment}
        contentGuidance={undefined}
        supervisionLevel={supervisionLevel}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );

    const contentGuidanceTitle = queryByText("Content guidance");
    expect(contentGuidanceTitle).not.toBeInTheDocument();
  });

  it("it should render Supervision level title for Lesson Equipment component", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );

    const supervisionLevelTitle = getByText("Supervision");
    expect(supervisionLevelTitle).toBeInTheDocument();
  });
  it("should not render supervision if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={null}
        updatedAt="2024-01-01T00:00:00Z"
      />,
    );

    const supervisionLevelTitle = queryByText("Supervision");
    expect(supervisionLevelTitle).not.toBeInTheDocument();
  });
});
