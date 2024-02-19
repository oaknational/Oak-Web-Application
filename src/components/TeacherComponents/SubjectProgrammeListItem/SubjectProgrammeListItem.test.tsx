import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectProgrammeListItem from "./SubjectProgrammeListItem";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const onClick = jest.fn();

const programme = {
  subjectSlug: "maths",
  subjectTitle: "Maths",
  keyStageSlug: "ks4",
  keyStageTitle: "Key stage 4",
  tierTitle: "Higher",
  tierSlug: "higher",
  programmeSlug: "maths-secondary-ks4-higher",
  tierDisplayOrder: null,
  examBoardSlug: null,
  examBoardTitle: null,
  examBoardDisplayOrder: null,
};

describe("ProgrammeListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders SubjectProgrammeListItem", () => {
    renderWithTheme(
      <SubjectProgrammeListItem onClick={onClick} programme={programme} />,
    );

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  it("calls tracking.tierSelected once, with correct props", async () => {
    renderWithTheme(
      <SubjectProgrammeListItem onClick={onClick} programme={programme} />,
    );

    const trier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(trier);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(programme);
  });
});
