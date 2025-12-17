import { screen } from "@testing-library/dom";

import SpecialistSubjectListingPage, {
  getStaticProps,
} from "@/pages/teachers/specialist/subjects";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { specialistSubjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/specialistSubjectListing.fixture";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

const mockSpecialistSubjectListing = jest
  .fn()
  .mockResolvedValue(specialistSubjectListingFixture2023());
const mockTopNav = jest.fn().mockResolvedValue(topNavFixture);

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => mockTopNav(),
    specialistSubjectListing: () => mockSpecialistSubjectListing(),
  },
}));

describe("pages/specialist/subjects", () => {
  it("renders therapies and specialist", () => {
    render(
      <SpecialistSubjectListingPage
        topNav={topNavFixture}
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
        topNav={topNavFixture}
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
        topNav={topNavFixture}
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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should call the api", async () => {
    await getStaticProps({});

    expect(mockSpecialistSubjectListing).toHaveBeenCalledTimes(1);
  });
  it("should fetch the data and return the props", async () => {
    const result = await getStaticProps({});

    expect(result).toEqual({
      props: {
        curriculumData: specialistSubjectListingFixture2023(),
        topNav: topNavFixture,
      },
    });
  });
  it("should return  404 page when there are no specialist or tharpies", async () => {
    mockSpecialistSubjectListing.mockResolvedValue(null);
    const result = await getStaticProps({});
    expect(result).toEqual({ notFound: true });
  });
});
