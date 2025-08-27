import KeyStageKeypad from "./KeyStageKeypad";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";

const keyStages = ["EYFS", "KS1", "KS2", "KS3", "KS4"];

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
});
