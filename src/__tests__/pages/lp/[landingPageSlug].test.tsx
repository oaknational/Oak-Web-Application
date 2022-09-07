import { screen, waitFor } from "@testing-library/react";

import LandingPageTemplate, {
  getStaticPaths,
  getStaticProps,
} from "../../../pages/lp/[landingPageSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import CMSClient, { LandingPage } from "../../../node-lib/cms";
import renderWithSeo from "../../__helpers__/renderWithSeo";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testLandingPage: LandingPage = {
  id: "5",
  slug: "some-landing-page",
};

describe("pages/lp/[landingPageSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    mockCMSClient.landingPages.mockResolvedValue([testLandingPage]);
    mockCMSClient.landingPageBySlug.mockResolvedValue(testLandingPage);
  });

  describe("LandingPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(
        <LandingPageTemplate pageData={testLandingPage} isPreviewMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("some-landing-page")).toBeInTheDocument();
      });
    });

    describe("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo(
          <LandingPageTemplate
            pageData={testLandingPage}
            isPreviewMode={false}
          />
        );

        expect(seo).toEqual({});
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all landing pages", async () => {
      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { landingPageSlug: "some-landing-page" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct landing page", async () => {
      await getStaticProps({
        params: { landingPageSlug: "some-landing-page" },
      });

      expect(mockCMSClient.landingPageBySlug).toHaveBeenCalledWith(
        "some-landing-page",
        expect.anything()
      );
    });

    it("should return notFound when a landing page is missing", async () => {
      mockCMSClient.landingPageBySlug.mockResolvedValueOnce(null as never);

      const propsResult = await getStaticProps({
        params: { landingPageSlug: "some-landing-page" },
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
