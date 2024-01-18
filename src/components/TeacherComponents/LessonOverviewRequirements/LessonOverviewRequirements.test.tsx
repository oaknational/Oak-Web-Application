import { describe, expect, it } from "vitest";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import LessonOverviewRequirements from "@/components/TeacherComponents/LessonOverviewRequirements/LessonOverviewRequirements";

describe("LessonOverviewRequirements component", () => {
  const equipment = [{ equipment: "test scissors" }];
  const contentGuidance = [
    {
      contentGuidanceLabel: "test label",
      contentGuidanceArea: "test area",
      contentGuidanceDescription: "test details",
    },
  ];
  const supervisionLevel = "test supervision level";

  it("it should render title equipment title and not other titles", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonOverviewRequirements
        helperIcon="equipment-required"
        equipment={equipment}
        heading={"Equipment"}
      />,
    );

    const equipmentTitle = getByText("Equipment");
    const contentGuidanceTitle = queryByText("Content guidance");
    const supervisionLevelTitle = queryByText("Supervision");
    expect(equipmentTitle).toBeInTheDocument();
    expect(contentGuidanceTitle).not.toBeInTheDocument();
    expect(supervisionLevelTitle).not.toBeInTheDocument();
  });

  it("it should render title content guidance title and not other titles", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonOverviewRequirements
        helperIcon={"content-guidance"}
        heading="Content guidance"
        contentGuidance={contentGuidance}
      />,
    );

    const contentGuidanceTitle = getByText("Content guidance");
    const equipmentTitle = queryByText("Equipment");
    const supervisionLevelTitle = queryByText("Supervision");
    expect(contentGuidanceTitle).toBeInTheDocument();
    expect(equipmentTitle).not.toBeInTheDocument();
    expect(supervisionLevelTitle).not.toBeInTheDocument();
  });

  it("it should render supervision title and not other titles", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonOverviewRequirements
        helperIcon={"supervision-level"}
        heading="Supervision"
        supervisionLevel={supervisionLevel}
      />,
    );

    const equipmentTitle = queryByText("Equipment");
    const contentGuidanceTitle = queryByText("Content guidance");
    const supervisionLevelTitle = getByText("Supervision");
    expect(supervisionLevelTitle).toBeInTheDocument();
    expect(contentGuidanceTitle).not.toBeInTheDocument();
    expect(equipmentTitle).not.toBeInTheDocument();
  });
});
