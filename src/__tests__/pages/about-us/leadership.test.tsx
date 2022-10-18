import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient, { AboutLeadershipPage } from "../../../node-lib/cms";
import AboutUsLeadership, {
  getStaticProps,
} from "../../../pages/about-us/leadership";
import { mockImageAsset } from "../../__helpers__/cms";

import { testAboutPageBaseData } from "./who-we-are.test";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testAboutLeadershipPageData: AboutLeadershipPage = {
  ...testAboutPageBaseData,
  heading: "Leadership",
  introPortableText: [],
  leadershipTeam: [
    {
      name: "name",
      id: "1",
      image: mockImageAsset(),
    },
  ],
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));
describe("pages/about/leadership.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutUsLeadership pageData={testAboutLeadershipPageData} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "About us"
      );
    });
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutUsLeadership pageData={testAboutLeadershipPageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutLeadershipPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
