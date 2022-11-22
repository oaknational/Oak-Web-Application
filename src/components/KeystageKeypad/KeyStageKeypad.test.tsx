import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import keystageKeypad from "../../browser-lib/fixtures/keystageKeypad";

import KeystageKeypad from ".";
const keyStages = ["1", "2", "3", "4"];
const years = ["6", "7", "8", "9", "10", "11"];

describe("components/Key Stage keypad", () => {
  test.each(keyStages)(
    "renders a key stage and year button with %p text",
    (keyStage) => {
      const { getAllByText } = renderWithTheme(
        <KeystageKeypad {...keystageKeypad} />
      );
      const keyStageButton = getAllByText(keyStage);

      expect(keyStageButton[0]).toBeInTheDocument();
    }
  );
  test.skip.each(years)("renders a year link with %p text", (year) => {
    const { getByText } = renderWithTheme(
      <KeystageKeypad {...keystageKeypad} />
    );
    const keyStageLink = getByText(year);

    expect(keyStageLink).toBeInTheDocument();
  });
});
