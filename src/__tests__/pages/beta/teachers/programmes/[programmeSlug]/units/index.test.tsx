import { GetServerSidePropsContext, PreviewData } from "next";
import { screen, waitFor } from "@testing-library/react";

import UnitListingPage, {
  getServerSideProps,
  SubjectUnitsListPageProps,
  URLParams,
} from "../../../../../../../pages/beta/teachers/programmes/[programmeSlug]/units";
import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";
import unitListingFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";

describe("pages/programmes/[programmeSlug]/units", () => {
  it("Renders title from props ", async () => {
    renderWithProviders()(
      <UnitListingPage curriculumData={unitListingFixture()} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Art"
      );
    });
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

  describe("getServerSideProps", () => {
    // it("Should fetch the correct data for tiered programme", async () => {
    //   const propsResult = (await getServerSideProps({
    //     params: {
    //       programmeSlug: "maths-higher-ks4-higher",
    //     },
    //     query: {},
    //   } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
    //     props: SubjectUnitsListPageProps;
    //   };

    //   expect(propsResult.props.curriculumData).toEqual(unitListingFixture());
    // });
    it("Should fetch the correct data", async () => {
      const propsResult = (await getServerSideProps({
        params: {
          programmeSlug: "art-primary-ks1",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: SubjectUnitsListPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(unitListingFixture());
    });
    it("should throw error", async () => {
      await expect(
        getServerSideProps(
          {} as GetServerSidePropsContext<URLParams, PreviewData>
        )
      ).rejects.toThrowError("No context.params");
    });
  });
});
