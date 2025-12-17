import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023";
import SpecialistProgrammeListingPage, {
  getStaticProps,
} from "@/pages/teachers/specialist/subjects/[subjectSlug]/programmes";
import { specialistProgrammeListingPageDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistProgrammes.fixture";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("pages/specialist/subjects/[subjectSlug]/programmes", () => {
  it("renders programmes", () => {
    render(
      <SpecialistProgrammeListingPage
        topNav={topNavFixture}
        curriculumData={specialistProgrammeListingPageDataFixture()}
      />,
    );

    const developmentStageCard = screen.getByText("Early development 1", {
      exact: false,
    });

    expect(developmentStageCard).toBeInTheDocument();
  });
  it("should link to unit listing page when there are multiple programmes for a subject", () => {
    render(
      <SpecialistProgrammeListingPage
        topNav={topNavFixture}
        curriculumData={specialistProgrammeListingPageDataFixture()}
      />,
    );

    const specialistCard = screen.getByText("Early development 1").closest("a");

    expect(specialistCard).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/early-development/units",
    );
  });
});

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  specialistProgrammeListing: jest.fn(),
}));

describe("getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should return  404 page when there are no programmes", async () => {
    const result = await getStaticProps({ params: { subjectSlug: "fake" } });
    expect(result).toEqual({ notFound: true });
  });
  it("Should call the api", async () => {
    await getStaticProps({ params: { subjectSlug: "numeracy" } });

    expect(curriculumApi.specialistProgrammeListing).toHaveBeenCalledTimes(1);
    expect(curriculumApi.specialistProgrammeListing).toHaveBeenCalledWith({
      subjectSlug: "numeracy",
    });
  });
  it("should fetch the data and return the props", async () => {
    const curriculumData = specialistProgrammeListingPageDataFixture();
    (curriculumApi.specialistProgrammeListing as jest.Mock).mockResolvedValue(
      curriculumData,
    );

    const result = await getStaticProps({
      params: { subjectSlug: "communication-and-language" },
    });

    expect(result).toEqual({
      props: {
        curriculumData,
      },
    });
  });
});
