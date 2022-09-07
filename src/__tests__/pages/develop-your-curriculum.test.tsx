import { screen, waitFor } from "@testing-library/react";

import { CurriculumPage } from "../../node-lib/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import { mockSeo, portableTextFromString } from "../__helpers__/cms";
import Curriculum from "../../pages/develop-your-curriculum";

const testCurriculumPageData: CurriculumPage = {
  id: "01",
  title: "Curriculum title",
  heading: "Curriculum heading",
  summaryPortableText: portableTextFromString("Planning summary"),
  info: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  gettingStarted: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  elements: {
    title: "element title",
    posts: [
      {
        title: "blog title",
        post: {
          title: "post title",
          slug: {
            current: "/",
          },
        },
      },
    ],
  },
  ourApproach: {
    bodyPortableText: portableTextFromString("block text"),
    title: "title",
    cta: {
      external: "/",
      label: "label",
      linkType: "external",
    },
  },
  seo: mockSeo(),
};

const getPageData = jest.fn(() => testCurriculumPageData);

describe("pages/curriculum.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../src/node-lib/cms/", () => ({
      __esModule: true,
      default: {
        curriculumPage: jest.fn(getPageData),
      },
    }));
  });

  it("Renders correct title ", async () => {
    renderWithProviders(
      <Curriculum pageData={testCurriculumPageData} isPreviewMode={false} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Curriculum title"
      );
    });
  });

  describe("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../pages/develop-your-curriculum"
      );
      await getStaticProps({
        params: {},
      });

      expect(getPageData).toHaveBeenCalledWith({
        previewMode: false,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      getPageData.mockResolvedValueOnce(null as never);

      const { getStaticProps } = await import(
        "../../pages/develop-your-curriculum"
      );
      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
