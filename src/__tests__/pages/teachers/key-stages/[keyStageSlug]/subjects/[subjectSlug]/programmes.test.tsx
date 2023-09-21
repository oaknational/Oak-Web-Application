import { GetServerSidePropsContext, PreviewData } from "next";

import ProgrammesListingPage, {
  getStaticPaths,
  getStaticProps,
  URLParams,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/programmes";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("programmes listing page", () => {
  describe("component rendering on page", () => {
    it("renders title from props ", () => {
      const { getByRole } = render(
        <ProgrammesListingPage {...tieredProgrammeListingFixture()} />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent("Maths");
    });

    it("renders the correct number of tiers and tier cards", () => {
      const { getAllByTestId } = render(
        <ProgrammesListingPage {...tieredProgrammeListingFixture()} />,
      );

      expect(getAllByTestId("programme-list-item")).toHaveLength(2);
    });
  });

  describe("SEO and Tracking", () => {
    it("renders the correct SEO details for programmes page", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage {...tieredProgrammeListingFixture()} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 3 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Higher",
        ogTitle: "Key stage 3 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Foundation, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();

      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await getStaticProps({
        params: {
          keyStageSlug: "ks4",
          subjectSlug: "maths-l",
        },
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: ProgrammeListingPageData;
      };

      expect(testRes.props).toEqual(tieredProgrammeListingFixture());
    });
    it("should throw error when not provided context params", async () => {
      await expect(
        getStaticProps({} as GetServerSidePropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context params");
    });
  });
});
