import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import SubjectProgrammeListing from "./SubjectProgrammeListing";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";
import { examBoardProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/examboardListing.fixture";

const curriculumData = tieredProgrammeListingFixture();
const examBoardCurriculumData = examBoardProgrammeListingFixture();

const render = renderWithProviders();

describe("SubjectProgrammeListing", () => {
  it("render a tier subject component with heading ", () => {
    render(<SubjectProgrammeListing {...curriculumData} />);

    expect(screen.getByText("Select tier of learning")).toBeInTheDocument();
  });
  it("it does not render a tier heading when there are no tiers ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
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
    render(<SubjectProgrammeListing {...examBoardCurriculumData} />);

    expect(screen.getByText("Select exam board")).toBeInTheDocument();
  });

  it("it does not render an exam board heading when there is no exam boards  ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
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
      <SubjectProgrammeListing {...curriculumData} />,
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
      <SubjectProgrammeListing {...curriculumData} />,
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
});
