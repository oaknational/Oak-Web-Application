import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonHelper from "./LessonHelper";

describe("LessonHelper component", () => {
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
      <LessonHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />
    );

    const equipmentTitle = getByText("Equipment");
    expect(equipmentTitle).toBeInTheDocument();
  });

  it("should not render equipment if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonHelper
        equipment={null}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />
    );

    const equipmentTitle = queryByText("Equipment");
    expect(equipmentTitle).not.toBeInTheDocument();
  });

  it("it should render content guidance title for Lesson Equipment component", () => {
    const { getByText } = renderWithTheme(
      <LessonHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />
    );
    const contentGuidanceTitle = getByText("Content guidance");
    expect(contentGuidanceTitle).toBeInTheDocument();
  });

  it("should not render content guidance if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonHelper
        equipment={equipment}
        contentGuidance={undefined}
        supervisionLevel={supervisionLevel}
      />
    );

    const contentGuidanceTitle = queryByText("Content guidance");
    expect(contentGuidanceTitle).not.toBeInTheDocument();
  });

  it("it should render Supervision level title for Lesson Equipment component", () => {
    const { getByText } = renderWithTheme(
      <LessonHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />
    );

    const supervisionLevelTitle = getByText("Supervision");
    expect(supervisionLevelTitle).toBeInTheDocument();
  });
  it("should not render supervision if null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonHelper
        equipment={equipment}
        contentGuidance={contentGuidance}
        supervisionLevel={null}
      />
    );

    const supervisionLevelTitle = queryByText("Supervision");
    expect(supervisionLevelTitle).not.toBeInTheDocument();
  });
});
