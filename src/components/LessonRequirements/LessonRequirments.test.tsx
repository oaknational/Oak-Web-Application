import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import LessonRequirements from "@/components/LessonRequirements/LessonRequirements";

describe("LessonRequirements component", () => {
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
      <LessonRequirements
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
      <LessonRequirements
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
      <LessonRequirements
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
  it("it should render the correct legacy license", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonRequirements
        helperIcon={"supervision-level"}
        heading="License"
        isLegacyLicense={true}
      />,
    );
    const preAlbCopyright = getByText(
      "This content is made available by Oak and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("License");
    expect(licenseTitle).toBeInTheDocument();
  });
  it("it should render the correct license", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonRequirements
        helperIcon={"supervision-level"}
        heading="License"
        isLegacyLicense={false}
      />,
    );
    const preAlbCopyright = getByText(
      "This content is © Oak National Academy (2023), licensed on",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("License");
    expect(licenseTitle).toBeInTheDocument();
  });
});
