import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import { mockSeo, portableTextFromString } from "../__helpers__/cms";
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

  seo: mockSeo(),
};

const getPageData = jest.fn(() => testSupportPageData);

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
    renderWithProviders(<Support pageData={testSupportPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Support title"
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<Support pageData={testSupportPageData} />);

      expect(seo).toEqual({});
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
