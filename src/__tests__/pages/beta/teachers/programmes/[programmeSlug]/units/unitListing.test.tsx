import curriculumApi from "../../../../../../../node-lib/curriculum-api/__mocks__";
import UnitListingPage, {
  getStaticPaths,
  getStaticProps,
} from "../../../../../../../pages/beta/[viewType]/programmes/[programmeSlug]/units";
import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";
import unitListingFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";

jest.mock("next/router", () => require("next-router-mock"));

const utilsMock = jest.requireMock("../../../../../../../utils/resultsPerPage");
jest.mock("../../../../../../../utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

const render = renderWithProviders();

describe("pages/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title from props ", () => {
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Computing");
  });

  it("renders nav for tiers for programme that included tiers", () => {
    const { getByTestId } = render(
      <UnitListingPage curriculumData={unitListingWithTiersFixture()} />
    );

    expect(getByTestId("tiers-nav")).toBeInTheDocument();
  });

  describe("SEO", () => {
    it("renders the correct SEO details for tiered programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingWithTiersFixture()} />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Computing tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Core, Higher",
        ogTitle: "Key stage 4 Computing tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Foundation, Core, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
    it("renders the correct SEO details for non tiered programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingFixture()} />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Computing Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Programme units",
        ogTitle:
          "Free KS4 Computing Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Programme units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
    it("renders the correct SEO details for programmes with pagination", async () => {
      utilsMock.RESULTS_PER_PAGE = 10;
      const { seo } = renderWithSeo()(
        <UnitListingPage
          curriculumData={{
            ...unitListingFixture(),
          }}
        />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Computing Teaching Resources for Lesson Planning | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Programme units",
        ogTitle:
          "Free KS4 Computing Teaching Resources for Lesson Planning | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Programme units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all programmes", async () => {
      await getStaticPaths();

      expect(curriculumApi.unitListingPaths).toHaveBeenCalledTimes(1);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "art-primary-ks1",
          viewType: "teachers",
        },
      });

      expect(curriculumApi.unitListing).toHaveBeenCalledTimes(1);
      expect(curriculumApi.unitListing).toHaveBeenCalledWith({
        programmeSlug: "art-primary-ks1",
      });
    });
  });
});
