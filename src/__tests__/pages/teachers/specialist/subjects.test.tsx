import { screen } from "@testing-library/dom";

import SpecialistSubjectListingPage, { getStaticProps } from "@/pages/teachers/specialist/subjects";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import { specialistSubjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/specialistSubjectListing.fixture";

const render = renderWithProviders();

describe("pages/specialist/subjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders therapies and specialist", () => {
    render(
      <SpecialistSubjectListingPage
        curriculumData={specialistSubjectListingFixture2023()}
      />,
    );

    const therapyCard = screen.getByRole("link", {
      name: "Physical Therapy: 1 unit, 1 lesson",
    });
    const specialistCard = screen.getByRole("link", {
      name: "Numeracy: 5 units, 10 lessons",
    });

    expect(therapyCard).toBeInTheDocument();
    expect(specialistCard).toBeInTheDocument();
  });
  it("should link to programme listing page when there are multiple programmes for a subject", () => {
    render(
      <SpecialistSubjectListingPage
        curriculumData={specialistSubjectListingFixture2023()}
      />,
    );

    const specialistCard = screen.getByRole("link", {
      name: "Numeracy: 5 units, 10 lessons",
    });

    expect(specialistCard).toHaveAttribute(
      "href",
      "/teachers/specialist/subjects/numeracy/programmes",
    );
  });
  it("should link to unit listing page when there is a single programme for a subject", () => {
    render(
      <SpecialistSubjectListingPage
        curriculumData={specialistSubjectListingFixture2023()}
      />,
    );

    const therapyCard = screen.getByRole("link", {
      name: "Physical Therapy: 1 unit, 1 lesson",
    });

    expect(therapyCard).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/physical-therapy/units",
    );
  });
});

describe("getStaticProps", () => {
  it("Should fetch the correct data", async () => {
    await getStaticProps({});

    expect(curriculumApi.specialistSubjectListing).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistSubjectListing).toHaveBeenCalledWith();
  });
});
