import { GetServerSidePropsContext, PreviewData } from "next";

import curriculumApi from "../../../../../../../node-lib/curriculum-api/__mocks__";
import ProgrammesListingPage, {
  getStaticPaths,
  getStaticProps,
  URLParams,
} from "../../../../../../../pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects/[subjectSlug]/programmes";
import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";
import { programmeListingFixture } from "../../../../../../../node-lib/curriculum-api/fixtures/tierListing.fixture";
import { ProgrammeListingPageData } from "../../../../../../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const render = renderWithProviders();

describe("programmes listing page", () => {
  describe("component rendering on page", () => {
    it("renders title from props ", () => {
      const { getByRole } = render(
        <ProgrammesListingPage {...programmeListingFixture()} />
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent("Maths");
    });

    it("renders the correct number of tiers and tier cards", () => {
      const { getAllByTestId } = render(
        <ProgrammesListingPage {...programmeListingFixture()} />
      );

      expect(getAllByTestId("programme-list-item")).toHaveLength(4);
    });
  });

  describe("SEO and Tracking", () => {
    it("renders the correct SEO details for programmes page", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage {...programmeListingFixture()} />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 3 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Core, Foundation, Higher",
        ogTitle: "Key stage 3 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Core, Foundation, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });
  describe("getStaticPaths", () => {
    it("should fetch the correct data", async () => {
      await getStaticPaths();
      expect(curriculumApi.programmeListingPaths).toHaveBeenCalledTimes(1);
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await getStaticProps({
        params: {
          keyStageSlug: "ks4",
          subjectSlug: "maths",
        },
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: ProgrammeListingPageData;
      };

      expect(testRes.props).toEqual(programmeListingFixture());
    });
    it("should throw error when not provided context params", async () => {
      await expect(
        getStaticProps({} as GetServerSidePropsContext<URLParams, PreviewData>)
      ).rejects.toThrowError("No context params");
    });
  });
});
