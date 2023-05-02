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
        slug="maths"
        title="Maths"
        keyStageSlug="ks4"
        keyStageTitle="Key stage 4"
        tierTitle="Higher"
        tierSlug="higher"
        totalUnitCount={3}
        activeLessonCount={4}
        programmeSlug="maths-secondary-ks4-higher"
        background="grey2"
      />
    );

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  it("calls tracking.tierSelected once, with correct props", async () => {
    renderWithTheme(
      <TierListItem
        slug="maths"
        title="Maths"
        keyStageSlug="ks4"
        keyStageTitle="Key Stage 4"
        tierTitle="Higher"
        tierSlug="higher"
        totalUnitCount={3}
        activeLessonCount={4}
        programmeSlug="maths-secondary-ks4-higher"
        background="grey2"
      />
    );

    const trier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(trier);

    expect(tierSelected).toHaveBeenCalledTimes(1);
    expect(tierSelected).toHaveBeenCalledWith({
      subjectTitle: "Maths",
      subjectSlug: "maths",
      tierName: "Higher",
      keyStageTitle: "Key Stage 4",
      keyStageSlug: "ks4",
      analyticsUseCase: ["Teacher"],
    });
  });
});
