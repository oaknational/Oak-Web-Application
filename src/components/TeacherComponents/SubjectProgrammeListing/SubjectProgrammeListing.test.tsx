import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectProgrammeListing from "./SubjectProgrammeListing";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";
import { examBoardProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/examboardListing.fixture";

const curriculumData = tieredProgrammeListingFixture();
const examBoardCurriculumData = examBoardProgrammeListingFixture();

const render = renderWithProviders();
const onClick = vi.fn();

describe("SubjectProgrammeListing", () => {
  it("render a tier subject component with heading ", () => {
    render(<SubjectProgrammeListing onClick={onClick} {...curriculumData} />);

    expect(screen.getByText("Select tier of learning")).toBeInTheDocument();
  });
  it("it does not render a tier heading when there are no tiers ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.tierSlug,
          ),
        }}
      />,
    );

    const tiersTitle = queryByText("Learning tiers");

    expect(tiersTitle).toBeNull();
  });
  it("render a exam board subject component with heading ", () => {
    render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...examBoardCurriculumData}
      />,
    );

    expect(screen.getByText("Select exam board")).toBeInTheDocument();
  });

  it("it does not render an exam board heading when there is no exam boards  ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.examBoardSlug,
          ),
        }}
      />,
    );

    const examsTitle = queryByText("Exam boards");

    expect(examsTitle).toBeNull();
  });

  it("render a list of card items with the name of the programmes ", () => {
    const { getAllByRole } = render(
      <SubjectProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
      "Higher",
    );
    expect(getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
      "Foundation",
    );
  });

  it("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(
      <SubjectProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks4-foundation/units",
    );
    expect(getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks4-higher/units",
    );
  });
  it("calls onclick once, with correct props", async () => {
    render(<SubjectProgrammeListing onClick={onClick} {...curriculumData} />);

    const tier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(tier);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      examBoardDisplayOrder: null,
      examBoardSlug: null,
      examBoardTitle: null,
      programmeSlug: "maths-secondary-ks4-higher",
      subjectTitle: "Maths",
      tierDisplayOrder: "3",
      tierSlug: "higher",
      tierTitle: "Higher",
    });
  });
});
