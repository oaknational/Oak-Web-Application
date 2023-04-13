import { screen } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient from "../../../node-lib/cms";
import AboutUsLeadership, {
  getStaticProps,
} from "../../../pages/about-us/leadership";
import {
  mockImageAsset,
  mockSeoResult,
  portableTextFromString,
} from "../../__helpers__/cms";
import { AboutLeadershipPage } from "../../../common-lib/cms-types";

import { testAboutPageBaseData } from "./about-us.fixtures";

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
      bioPortableText: portableTextFromString("Great person"),
    },
    {
      name: "name",
      role: "chief executive",
      id: "1",
      image: mockImageAsset(),
      bioPortableText: portableTextFromString(
        "This somethine else before, now does this"
      ),
    },
  ],
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("pages/about/leadership.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Renders correct title ", async () => {
    render(<AboutUsLeadership pageData={testAboutLeadershipPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "About us"
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <AboutUsLeadership pageData={testAboutLeadershipPageData} />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We're doing the things that need to get done.",
        ogTitle: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We're doing the things that need to get done.",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      });
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
