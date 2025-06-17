import { screen } from "@testing-library/dom";

import KeyStageKeypad from "./KeyStageKeypad";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";

const keyStages = ["EYFS", "1", "2", "3", "4"];

describe("components/Key Stage keypad", () => {
  test.each(keyStages)(
    "renders a key stage and year button with %p text",
    (keyStage) => {
      const { getAllByText } = renderWithTheme(
        <KeyStageKeypad {...keyStageKeypad} />,
      );
      const keyStageButton = getAllByText(keyStage);

      expect(keyStageButton[0]).toBeInTheDocument();
    },
  );

  test("renders buttons in correct order for screen size", () => {
    renderWithTheme(<KeyStageKeypad {...keyStageKeypad} years={undefined} />);

    const keyStageButtons = screen.getAllByRole("button");
    expect(keyStageButtons[0]).toHaveTextContent("KS1");
    expect(keyStageButtons[4]).toHaveTextContent("EYFS");
  });
});
