import { screen } from "@testing-library/dom";

import SpecialistSubjectListingPage, {
  getStaticProps,
} from "@/pages/teachers/specialist/subjects";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import { specialistSubjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/specialistSubjectListing.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

describe("pages/specialist/subjects", () => {
  beforeAll(() => {
    setUseUserReturn(mockLoggedIn);
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

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  specialistSubjectListing: jest.fn(),
}));

describe("getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should return  404 page when there are no specialist or tharpies", async () => {
    const result = await getStaticProps({});
    expect(result).toEqual({ notFound: true });
  });
  it("Should call the api", async () => {
    await getStaticProps({});

    expect(curriculumApi.specialistSubjectListing).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistSubjectListing).toHaveBeenCalledWith();
  });
  it("should fetch the data and return the props", async () => {
    const curriculumData = specialistSubjectListingFixture2023();
    (curriculumApi.specialistSubjectListing as jest.Mock).mockResolvedValue(
      curriculumData,
    );

    const result = await getStaticProps({});

    expect(result).toEqual({
      props: {
        curriculumData,
      },
    });
  });
});
