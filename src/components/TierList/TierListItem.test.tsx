import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import TierListItem from "./TierListItem";

const tierSelected = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      tierSelected: (...args: unknown[]) => tierSelected(...args),
    },
  }),
}));

describe("TierListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders TierListItem", () => {
    renderWithTheme(
      <TierListItem
        subjectSlug="maths"
        subjectName="Maths"
        keyStageSlug="ks4"
        keyStageName="Key Stage 4"
        title="Higher"
        slug="higher"
        unitCount={3}
        lessonCount={4}
        background="grey2"
      />
    );

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  it("calls tracking.tierSelected once, with correct props", async () => {
    renderWithTheme(
      <TierListItem
        subjectSlug="maths"
        subjectName="Maths"
        keyStageSlug="ks4"
        keyStageName="Key Stage 4"
        title="Higher"
        slug="higher"
        unitCount={3}
        lessonCount={4}
        background="grey2"
      />
    );

    const trier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(trier);

    expect(tierSelected).toHaveBeenCalledTimes(1);
    expect(tierSelected).toHaveBeenCalledWith({
      unitName: "",
      unitSlug: "",
      unitId: 0,
      subjectName: "Maths",
      subjectSlug: "maths",
      tierName: "Higher",
      keyStageName: "Key Stage 4",
      keyStageSlug: "ks4",
      useCase: ["Teacher"],
    });
  });
});
