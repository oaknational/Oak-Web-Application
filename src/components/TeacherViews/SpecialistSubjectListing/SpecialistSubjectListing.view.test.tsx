import { screen } from "@testing-library/react";

import SpecialistSubjectListingPage from "./SpecialistSubjectListing.view";
import {
  specialistSubjectListingFixture,
  therapiesSubjectListingFixture,
} from "./SpecialistSubjectListing.fixture";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SpecialistSubjectListing", () => {
  it("renders a heading with the page title", () => {
    renderWithTheme(
      <SpecialistSubjectListingPage
        specialist={specialistSubjectListingFixture}
        therapies={therapiesSubjectListingFixture}
      />,
    );
    const heading = screen.getByRole("heading", {
      name: /Specialist & Therapies/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders a specialist subject section", () => {
    renderWithTheme(
      <SpecialistSubjectListingPage
        specialist={specialistSubjectListingFixture}
        therapies={therapiesSubjectListingFixture}
      />,
    );

    const specialistHeading = screen.getByRole("heading", {
      name: /Specialist/i,
      level: 3,
    });
    expect(specialistHeading).toBeInTheDocument();

    const specialistSummary = screen.getByText(
      "Our Specialist curriculum helps you to support learning around three stages; early development, building understanding and applying learning, as well as creative arts and physical development.",
    );

    expect(specialistSummary).toBeInTheDocument();

    const subjectCards = screen.getAllByTestId("specialist-subject-card");
    expect(subjectCards).toHaveLength(3);
  });
  it("renders a therapies subject section", () => {
    renderWithTheme(
      <SpecialistSubjectListingPage
        specialist={specialistSubjectListingFixture}
        therapies={therapiesSubjectListingFixture}
      />,
    );

    const therapiesHeading = screen.getByRole("heading", {
      name: /Therapies/i,
      level: 3,
    });
    expect(therapiesHeading).toBeInTheDocument();

    const therapiesSummary = screen.getByText(
      "These resources provide tools for delivering support across four therapeutic streams. Choose the best starting point or approach to meet your pupils' developmental needs.",
    );
    expect(therapiesSummary).toBeInTheDocument();

    const subjectCards = screen.getAllByTestId("therapies-subject-card");
    expect(subjectCards).toHaveLength(4);
  });
});
