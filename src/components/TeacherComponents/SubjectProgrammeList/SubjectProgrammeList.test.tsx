import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectProgrammeList from "./SubjectProgrammeList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: jest.fn(),
  }),
}));

const onClick = jest.fn();

describe("ProgrammeList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <SubjectProgrammeList
        onClick={onClick}
        {...tieredProgrammeListingFixture()}
      />,
    );

    waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
        "Foundation",
      );
      expect(screen.getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
        "Core",
      );
      expect(screen.getAllByRole("heading", { level: 3 })[2]?.textContent).toBe(
        "Higher",
      );
    });
  });
  it("calls tracking.tierSelected once, with correct props", async () => {
    renderWithTheme(
      <SubjectProgrammeList
        onClick={onClick}
        {...tieredProgrammeListingFixture()}
      />,
    );

    const trier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(trier);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      examBoardDisplayOrder: null,
      examBoardSlug: null,
      examBoardTitle: null,
      programmeSlug: "maths-secondary-ks4-higher-l",
      subjectTitle: "Maths",
      tierDisplayOrder: "3",
      tierSlug: "higher",
      tierTitle: "Higher",
    });
  });
});
