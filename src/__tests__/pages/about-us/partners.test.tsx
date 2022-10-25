import { screen } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient from "../../../node-lib/cms";
import { AboutPartnersPage } from "../../../common-lib/cms-types";
import AboutPartners, {
  getStaticProps,
} from "../../../pages/about-us/partners";

import { testAboutPageBaseData } from "./who-we-are.test";

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
  seo: {},
};

describe("pages/about-us/board.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<AboutPartners pageData={testPartnersPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "About us"
    );
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutPartners pageData={testPartnersPageData} />
      );

      expect(seo).toEqual({});
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
