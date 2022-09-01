import { screen, waitFor } from "@testing-library/react";

import LandingPageTemplate, {
  getStaticPaths,
  getStaticProps,
  LandingPageProps,
} from "../../../pages/lp/[landingPageSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import CMSClient, { LandingPage } from "../../../node-lib/cms";

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

  describe("PolicyPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(
        <LandingPageTemplate pageData={testLandingPage} isPreviewMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("some-landing-page")).toBeInTheDocument();
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all policy pages", async () => {
      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { landingPageSlug: "some-landing-page" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct policy page", async () => {
      await getStaticProps({
        params: { landingPageSlug: "some-landing-page" },
      });

      expect(mockCMSClient.landingPageBySlug).toHaveBeenCalledWith(
        "some-landing-page",
        expect.anything()
      );
    });

    it("Should serialize the policy updated at date to an ISO date", async () => {
      const propsResult = (await getStaticProps({
        params: { landingPageSlug: "some-landing-page" },
      })) as { props: LandingPageProps };

      expect(propsResult?.props?.pageData).toMatchObject({
        slug: "some-landing-page",
      });
    });
  });
});
