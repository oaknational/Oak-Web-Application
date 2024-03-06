import { screen } from "@testing-library/react";

import SpecialistProgrammeListingView from "./SpecialistProgrammeListing.view";
import { specialistProgrammeListing } from "./SpecialistProgrammeListing.fixture";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SpecialistSubjectListing", () => {
  it("renders a subject heading", () => {
    renderWithTheme(
      <SpecialistProgrammeListingView {...specialistProgrammeListing} />,
    );
    const heading = screen.getByRole("heading", {
      name: /Maths/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders a description", () => {
    renderWithTheme(
      <SpecialistProgrammeListingView {...specialistProgrammeListing} />,
    );

    const description = screen.getByText(
      "Help your pupils with their communication ",
      {
        exact: false,
      },
    );
    expect(description).toBeInTheDocument();
  });
  it("renders programme cards", () => {
    renderWithTheme(
      <SpecialistProgrammeListingView {...specialistProgrammeListing} />,
    );

    const programmeCard = screen.getByText("KS1");
    expect(programmeCard).toBeInTheDocument();
  });
  it("renders links in programme cards", () => {
    renderWithTheme(
      <SpecialistProgrammeListingView {...specialistProgrammeListing} />,
    );

    const programmeLink = screen.getByRole("link", {
      name: /KS1/i,
    });
    expect(programmeLink).toBeInTheDocument();
    expect(programmeLink).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/maths-ks1/units",
    );
  });
});
