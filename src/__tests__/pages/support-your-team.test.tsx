import renderWithProviders from "../__helpers__/renderWithProviders";
import {
  mockSeo,
  mockSeoResult,
  portableTextFromString,
} from "../__helpers__/cms";
import Support from "../../pages/support-your-team";
import renderWithSeo from "../__helpers__/renderWithSeo";
import { SupportPage } from "../../common-lib/cms-types/supportPage";

const testSupportPageData: SupportPage = {
  id: "01",
  title: "Support title",
  heading: "Support heading",
  summaryPortableText: portableTextFromString("Planning summary"),
  planning: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  curriculum: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  development: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  cover: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    quote: {
      text: "quote",
    },
  },

  seo: mockSeo({
    title: "Support for Schools - Lesson Planning and Curriculum",
    description:
      "Our thousands of free curriculum resources help teachers in your school reduce lesson planning workload, build confidence in curriculum design, manage cover lessons and work for absent pupils. Find out more.",
  }),
};

const getPageData = jest.fn(() => testSupportPageData);

const render = renderWithProviders();

describe("pages/support-your-team.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../src/node-lib/cms/", () => ({
      __esModule: true,
      default: {
        supportPage: jest.fn(getPageData),
      },
    }));
  });

  it("Renders correct title ", () => {
    const { getByRole } = render(<Support pageData={testSupportPageData} />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe(
      "Support title",
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details ", async () => {
      const { seo } = renderWithSeo()(
        <Support pageData={testSupportPageData} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Support for Schools - Lesson Planning and Curriculum | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Our thousands of free curriculum resources help teachers in your school reduce lesson planning workload, build confidence in curriculum design, manage cover lessons and work for absent pupils. Find out more.",
        ogTitle:
          "Support for Schools - Lesson Planning and Curriculum | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Our thousands of free curriculum resources help teachers in your school reduce lesson planning workload, build confidence in curriculum design, manage cover lessons and work for absent pupils. Find out more.",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("../../pages/support-your-team");
      await getStaticProps({
        params: {},
      });

      expect(getPageData).toHaveBeenCalledWith({
        previewMode: false,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      getPageData.mockResolvedValueOnce(null as never);

      const { getStaticProps } = await import("../../pages/support-your-team");
      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
