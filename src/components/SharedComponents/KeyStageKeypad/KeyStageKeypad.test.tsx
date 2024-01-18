import userEvent from "@testing-library/user-event";

import KeyStageKeypad from "./KeyStageKeypad";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";

const keyStages = ["1", "2", "3", "4"];
const years = ["6", "7", "8", "9", "10", "11"];

const keyStageSelected = vi.fn();

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      keyStageSelected: (...args: unknown[]) => keyStageSelected(...args),
    },
  }),
}));

describe("components/Key Stage keypad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("calls tracking.keyStageSelected once, with correct props", async () => {
    const { getByText } = renderWithTheme(
      <KeyStageKeypad {...keyStageKeypad} />,
    );
    const keyStageButton = getByText("KS1");

    const user = userEvent.setup();
    await user.click(keyStageButton);

    expect(keyStageSelected).toHaveBeenCalledTimes(1);
    expect(keyStageSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key Stage 1",
      keyStageSlug: "ks1",
      navigatedFrom: "card",
      analyticsUseCase: null,
    });
  });

  test.skip.each(years)("renders a year link with %p text", (year) => {
    const { getByText } = renderWithTheme(
      <KeyStageKeypad {...keyStageKeypad} />,
    );
    const keyStageLink = getByText(year);

    expect(keyStageLink).toBeInTheDocument();
  });
});
