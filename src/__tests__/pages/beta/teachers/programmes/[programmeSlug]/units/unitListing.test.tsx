import curriculumApi from "../../../../../../../node-lib/curriculum-api/__mocks__";
import UnitListingPage, {
  getStaticPaths,
  getStaticProps,
} from "../../../../../../../pages/beta/teachers/programmes/[programmeSlug]/units";
import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";
import unitListingFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";
import useTrackPageView from "../../../../../../../hooks/useTrackPageView";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("../../../../../../../hooks/useTrackPageView");

const render = renderWithProviders();

describe("pages/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title from props ", () => {
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Art");
  });

  it("renders nav for tiers for programme that included tiers", () => {
    const { getByTestId } = render(
      <UnitListingPage curriculumData={unitListingWithTiersFixture()} />
    );

    expect(getByTestId("tiers-nav")).toBeInTheDocument();
  });

  it("makes a correct page tracking call", () => {
    render(<UnitListingPage curriculumData={unitListingFixture()} />);

    expect(useTrackPageView).toHaveBeenCalledWith({ pageName: "Unit Listing" });
  });

  describe("SEO", () => {
    it("renders the correct SEO details for tiered programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingWithTiersFixture()} />
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Core, Higher",
        ogTitle: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
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
        title: "Units | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Programme units",
        ogTitle: "Units | NEXT_PUBLIC_SEO_APP_NAME",
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
        params: { programmeSlug: "art-primary-ks1" },
      });

      expect(curriculumApi.unitListing).toHaveBeenCalledTimes(1);
      expect(curriculumApi.unitListing).toHaveBeenCalledWith({
        programmeSlug: "art-primary-ks1",
      });
    });
  });
});
