import { screen, within } from "@testing-library/react";

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
      name: /Specialist and therapies/i,
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
      level: 2,
    });
    expect(specialistHeading).toBeInTheDocument();

    const specialistSummary = screen.getByText(
      "Our specialist curriculum helps you to support learning around three stages; early development, building understanding and applying learning, as well as creative arts and physical development.",
    );

    expect(specialistSummary).toBeInTheDocument();

    const subjectCardLists = screen.getAllByTestId(
      "specialist-subject-card-section",
    );
    expect(subjectCardLists).toHaveLength(2);

    if (!subjectCardLists[0]) throw new Error("No subject card list found");
    const specialistSubjectCards = within(subjectCardLists[0]).getAllByTestId(
      "specialist-subject-card",
    );
    expect(specialistSubjectCards).toHaveLength(5);
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
      level: 2,
    });
    expect(therapiesHeading).toBeInTheDocument();

    const therapiesSummary = screen.getByText(
      "These resources provide tools for delivering support across four therapeutic streams. Choose the best starting point or approach to meet your pupils' developmental needs.",
    );
    expect(therapiesSummary).toBeInTheDocument();

    const subjectCardLists = screen.getAllByTestId(
      "specialist-subject-card-section",
    );
    expect(subjectCardLists).toHaveLength(2);

    if (!subjectCardLists[1]) throw new Error("No subject card list found");
    const therapySubjectCards = within(subjectCardLists[1]).getAllByTestId(
      "specialist-subject-card",
    );
    expect(therapySubjectCards).toHaveLength(4);
  });
  it("renders links in subject cards", () => {
    renderWithTheme(
      <SpecialistSubjectListingPage
        specialist={specialistSubjectListingFixture}
        therapies={therapiesSubjectListingFixture}
      />,
    );

    const subjectWithProgrammeLink = screen.getByRole("link", {
      name: /Creative Arts/i,
    });
    expect(subjectWithProgrammeLink).toBeInTheDocument();
    expect(subjectWithProgrammeLink).toHaveAttribute(
      "href",
      "/teachers/specialist/subjects/creative-arts/programmes",
    );

    const subjectWithoutProgrammeLink = screen.getByRole("link", {
      name: /Speech and Language Therapy/i,
    });
    expect(subjectWithoutProgrammeLink).toBeInTheDocument();
    expect(subjectWithoutProgrammeLink).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/speech-and-language-therapy/units",
    );
  });
});
