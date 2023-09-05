import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { tieredProgrammeListingFixture } from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

import SubjectProgrammeListing from "./SubjectProgrammeListing";

import { examboardProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/examboardListing.fixture";

const curriculumData = tieredProgrammeListingFixture();
const examboardCurriculumData = examboardProgrammeListingFixture();

const render = renderWithProviders();

describe("SubjectProgrammeListing", () => {
  test("render a tier subject component with heading ", () => {
    render(<SubjectProgrammeListing {...curriculumData} />);

    expect(screen.getByText("Select tier of learning")).toBeInTheDocument();
  });
  test("it does not render a tier heading when there are no tiers ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.tierSlug
          ),
        }}
      />
    );

    const tiersTitle = queryByText("Learning tiers");

    expect(tiersTitle).toBeNull();
  });
  test("render a exam board subject component with heading ", () => {
    render(<SubjectProgrammeListing {...examboardCurriculumData} />);

    expect(screen.getByText("Select exam board")).toBeInTheDocument();
  });

  test("it does not render an exam board heading when there is no exam boards  ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.examBoardSlug
          ),
        }}
      />
    );

    const examsTitle = queryByText("Exam boards");

    expect(examsTitle).toBeNull();
  });

  test("render a list of card items with the name of the programmes ", () => {
    const { getAllByRole } = render(
      <SubjectProgrammeListing {...curriculumData} />
    );

    expect(getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
      "Higher"
    );
    expect(getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
      "Foundation"
    );
  });

  test("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(
      <SubjectProgrammeListing {...curriculumData} />
    );

    expect(getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-foundation/units"
    );
    expect(getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-higher/units"
    );
  });
});
