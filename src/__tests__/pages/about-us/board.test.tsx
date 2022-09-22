import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient, { AboutBoardPage } from "../../../node-lib/cms";
import AboutBoard, { getStaticProps } from "../../../pages/about-us/board";

import { testAboutPageBaseData } from "./who-we-are.test";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testAboutBoardPageData: AboutBoardPage = {
  ...testAboutPageBaseData,
  sectionHeading: "Board",
  boardMembers: [
    {
      name: "name",
      id: "1",
      image: {
        asset: {
          _id: "",
          url: "",
        },
      },
    },
  ],
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
  documents: [
    {
      title:
        "Oak National Academy annual report and accounts for the period ended XX Month 2022",
      file: {
        asset: {
          extension: "pdf",
          size: 16758977,
          url: "/",
        },
      },
    },
  ],
  governancePortableText: [
    {
      _key: "f6c75b7124d5",
      _type: "block",
      children: [
        {
          _key: "4a23014a5ea40",
          _type: "span",
          marks: [],
          text: "Oak National Academy is a limited company incorporated under the Companies Act 2006 in September 2022 and whose sole shareholder is the Secretary of State for Education. It is a non-departmental public body (NDPB) which was established to work with schools, teachers and the wider education system and has a framework agreement with the Department for Education",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
};

describe("pages/about-us/board.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<AboutBoard pageData={testAboutBoardPageData} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "About us"
      );
    });
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutBoard pageData={testAboutBoardPageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutBoardPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
