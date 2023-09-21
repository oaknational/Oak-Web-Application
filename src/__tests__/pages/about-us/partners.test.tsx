import { screen } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient from "../../../node-lib/cms";
import { AboutPartnersPage } from "../../../common-lib/cms-types";
import AboutPartners, {
  getStaticProps,
} from "../../../pages/about-us/partners";
import { mockSeoResult } from "../../__helpers__/cms";

import { testAboutPageBaseData } from "./about-us.fixtures";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testPartnersPageData: AboutPartnersPage = {
  ...testAboutPageBaseData,
  heading: "Partners",
  curriculumPartners: [],
  techPartners: [],
  title: "About us",
  introPortableText: [
    {
      _key: "fba015024518",
      _type: "block",
      children: [
        {
          _key: "e55d6209321d0",
          _type: "span",
          marks: [],
          text: "Our interim board oversees all of Oak’s work. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence. The interim board will be in place whilst a permanent board is chosen through a public appointments process.",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
};

describe("pages/about-us/board.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders()(<AboutPartners pageData={testPartnersPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "About us",
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <AboutPartners pageData={testPartnersPageData} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We're doing the things that need to get done.",
        ogTitle: "About Us | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We're doing the things that need to get done.",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutPartnersPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
