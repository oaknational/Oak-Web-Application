import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";

import KeyStageKeypad from "./KeyStageKeypad";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";

const keyStages = ["EYFS", "1", "2", "3", "4"];
const years = ["6", "7", "8", "9", "10", "11"];

const keyStageSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      keyStageSelected: (...args: unknown[]) => keyStageSelected(...args),
    },
  }),
}));

describe("components/Key Stage keypad", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test("calls tracking.keyStageSelected once, with correct props", async () => {
    const { getAllByText } = renderWithTheme(
      <KeyStageKeypad {...keyStageKeypad} />,
    );
    const keyStageButton = getAllByText("KS1");
    const ks1Button = keyStageButton[0];
    if (!ks1Button) {
      throw new Error("failed to find ks1 button");
    }
    const user = userEvent.setup();
    await user.click(ks1Button);

    expect(keyStageSelected).toHaveBeenCalledTimes(1);
    expect(keyStageSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key Stage 1",
      keyStageSlug: "ks1",
      navigatedFrom: "card",
      analyticsUseCase: null,
    });
  });
  test("renders buttons in correct order for screen size", () => {
    renderWithTheme(<KeyStageKeypad {...keyStageKeypad} years={undefined} />);

    const keyStageButtons = screen.getAllByRole("button");
    expect(keyStageButtons[0]).toHaveTextContent("KS1");
    expect(keyStageButtons[4]).toHaveTextContent("EYFS");
  });

  test.skip.each(years)("renders a year link with %p text", (year) => {
    const { getByText } = renderWithTheme(
      <KeyStageKeypad {...keyStageKeypad} />,
    );
    const keyStageLink = getByText(year);

    expect(keyStageLink).toBeInTheDocument();
  });
});
