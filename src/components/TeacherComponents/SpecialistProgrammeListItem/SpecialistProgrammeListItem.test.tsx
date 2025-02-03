import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SpecialistProgrammeListItem, {
  SpecialistProgrammeListItemProps,
} from "./SpecialistProgrammeListItem";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { specialistProgrammeListingPageDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistProgrammes.fixture";

const onClick = vi.fn();

const programme = specialistProgrammeListingPageDataFixture()
  .programmes[0] as SpecialistProgrammeListItemProps["programme"];

describe("ProgrammeListItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SpecialistProgrammeListItem", () => {
    renderWithTheme(
      <SpecialistProgrammeListItem onClick={onClick} programme={programme} />,
    );

    expect(screen.getByText("Early development 1")).toBeInTheDocument();
  });

  it("calls on click with correct props", async () => {
    renderWithTheme(
      <SpecialistProgrammeListItem onClick={onClick} programme={programme} />,
    );

    const programmeCard = screen.getByText("Early development 1");

    const user = userEvent.setup();
    await user.click(programmeCard);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(programme);
  });
});
