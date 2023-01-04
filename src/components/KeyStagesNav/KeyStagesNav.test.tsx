import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import keyStagesNavData from "../../browser-lib/fixtures/keyStagesNav";

import KeyStagesNav from ".";
const keyStages = ["Early Years", "KS1", "KS2", "KS3", "KS4"];
const years = [
  "Reception",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
];

describe("components/Key Stages Nav", () => {
  test.each(keyStages)(
    "renders a key stage button with %p text",
    (keyStage) => {
      const { getByText } = renderWithTheme(
        <KeyStagesNav keyStages={keyStagesNavData} />
      );
      const keyStageButton = getByText(keyStage);

      expect(keyStageButton).toBeInTheDocument();
    }
  );

  it("it renders a nav with correct assessibilty description", () => {
    const { container } = renderWithTheme(
      <KeyStagesNav keyStages={keyStagesNavData} />
    );

    const nav = container.querySelector("nav");
    expect(nav).toHaveAccessibleName("key stages and year groups");
  });
  test.each(years)("renders a year link with %p text", (year) => {
    const { getByText } = renderWithTheme(
      <KeyStagesNav keyStages={keyStagesNavData} />
    );
    const keyStageLink = getByText(year);

    expect(keyStageLink).toBeInTheDocument();
  });
});
