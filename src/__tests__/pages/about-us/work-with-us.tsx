import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient, { AboutWorkWithUsPage } from "../../../node-lib/cms";
// import AboutWorkWithUs, { getStaticProps } from "../../../pages/about-us/work-with-us";

import { testAboutPageBaseData } from "./who-we-are.test";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

export const testAboutWorkWithUsPageData: AboutWorkWithUsPage = {
  ...testAboutPageBaseData,
  heading: "Work with us",
  introPortableText: [
    {
      _key: "24e20ee072ab",
      _type: "block",
      children: [
        {
          _key: "beefb74c12ee0",
          _type: "span",
          marks: [],
          text: "We’re excited to be at the heart of this new national collaboration, but no one can do this alone. A team is required. So if you’re as excited as we are – brilliant. We want to hear from you. There’s lots of ways to get involved - find out more below.",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
  cards: {
    joinTheTeam: {
      title: "Join the Oak team ",
      bodyPortableText: [
        {
          _key: "8230db06a2de",
          _type: "block",
          children: [
            {
              _key: "1654a5ff63560",
              _type: "span",
              marks: [],
              text: "We're hiring! If you share our values, and want to help make a difference, then join one of our remote-based teams: Education, Operations, Product & Engineering and School Support\n",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      image: null,
    },
    advisory: {
      title: "Advisory Groups",
      bodyPortableText: [
        {
          _key: "23a341ac20cd",
          _type: "block",
          children: [
            {
              _key: "e0be8b5862840",
              _type: "span",
              marks: [],
              text: "We're looking for a diverse range of experts to assess the evidence, and agree rigorous quality standards, specific for each subject.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      image: null,
    },
    curriculumPartner: {
      title: "Become a Curriculum Partner",
      bodyPortableText: [
        {
          _key: "b914c3fc016d",
          _type: "block",
          children: [
            {
              _key: "6e009e4fed9c0",
              _type: "span",
              marks: [],
              text: "If you've got a great curriculum, we'll be selecting partners to work with us across 14 subjects areas: Primary and Secondary Maths, Science, English, History, Geography and Music. [hubspot form].",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      image: null,
    },
    teacherResearch: {
      title: "Take part in teacher research",
      bodyPortableText: [
        {
          _key: "d65ecf3e50f4",
          _type: "block",
          children: [
            {
              _key: "c1aabcae9b7b0",
              _type: "span",
              marks: [],
              text: "Oak has always listened and responded to teachers; have your say by taking part in research with us, or by road-testing our resources in your school [hubspot form].",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      image: null,
    },
  },
};

// Mock implementations  for stubbed tests - replace with real imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AboutWorkWithUs = (_props: { pageData: unknown }) => <></>;
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const getStaticProps = (params: unknown) => {};

describe.skip("pages/about-us/work-with-us.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutWorkWithUs pageData={testAboutWorkWithUsPageData} />
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
        <AboutWorkWithUs pageData={testAboutWorkWithUsPageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutWorkWithUsPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
