import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ProgrammeListItem from "./ProgrammeListItem";

const tierSelected = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      tierSelected: (...args: unknown[]) => tierSelected(...args),
    },
  }),
}));

describe("ProgrammeListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ProgrammeListItem", () => {
    renderWithTheme(
      <ProgrammeListItem
        subjectSlug="maths"
        subjectTitle="Maths"
        keyStageSlug="ks4"
        keyStageTitle="Key stage 4"
        tierTitle="Higher"
        tierSlug="higher"
        unitCount={3}
        lessonCount={4}
        programmeSlug="maths-secondary-ks4-higher"
        background="grey2"
        tierDisplayOrder={null}
        examBoardSlug={null}
        examBoardTitle={null}
        examBoardDisplayOrder={null}
      />
    );

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  it("calls tracking.tierSelected once, with correct props", async () => {
    renderWithTheme(
      <ProgrammeListItem
        subjectSlug="maths"
        subjectTitle="Maths"
        keyStageSlug="ks4"
        keyStageTitle="Key Stage 4"
        tierTitle="Higher"
        tierSlug="higher"
        unitCount={3}
        lessonCount={4}
        programmeSlug="maths-secondary-ks4-higher"
        background="grey2"
        tierDisplayOrder={null}
        examBoardSlug={null}
        examBoardTitle={null}
        examBoardDisplayOrder={null}
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
      analyticsUseCase: null,
    });
  });
});
