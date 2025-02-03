import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectProgrammeListItem from "./SubjectProgrammeListItem";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const programme: ProgrammeListingPageData["programmes"][number] = {
  subjectTitle: "Maths",
  programmeSlug: "maths-secondary-ks4-higher",
  tierTitle: "Higher",
  tierSlug: "higher",
  tierDisplayOrder: null,
  examBoardSlug: null,
  examBoardTitle: null,
  examBoardDisplayOrder: null,
  pathwayDisplayOrder: null,
  pathwaySlug: null,
  pathwayTitle: null,
};

describe("ProgrammeListItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SubjectProgrammeListItem", () => {
    renderWithTheme(
      <SubjectProgrammeListItem onClick={() => {}} programme={programme} />,
    );

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  it("calls tracking.browseRefined once, with correct props", async () => {
    const onClick = vi.fn();

    renderWithTheme(
      <SubjectProgrammeListItem onClick={onClick} programme={programme} />,
    );

    const tier = screen.getByText("Higher");

    // Prevent the link from causing a navigation and an error in the console.
    screen
      .getByTestId("programme-list-item-link")
      .addEventListener("click", (event) => event.preventDefault());

    const user = userEvent.setup();
    await user.click(tier);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(programme);
  });
});
