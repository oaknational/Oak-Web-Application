import { screen, within } from "@testing-library/react";

import { BlogPostPreview, CurriculumPage } from "../../common-lib/cms-types";
import renderWithProviders from "../__helpers__/renderWithProviders";
import { mockSeo, portableTextFromString } from "../__helpers__/cms";
import Curriculum from "../../pages/develop-your-curriculum";
import renderWithSeo from "../__helpers__/renderWithSeo";

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
          slug: "some-post",
        } as BlogPostPreview,
      },
      {
        title: "other blog title",
        post: {
          title: "other post title",
          slug: "some-other-post",
        } as BlogPostPreview,
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

const render = renderWithProviders();

describe("pages/develop-your-curriculum.tsx", () => {
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

  it("Renders correct title ", () => {
    render(<Curriculum pageData={testCurriculumPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Curriculum title",
    );
  });

  it("renders the blog posts", async () => {
    render(<Curriculum pageData={testCurriculumPageData} />);
    const { posts } = testCurriculumPageData.elements;

    const container = screen.getByTestId("elements-of-curriculum");
    const links = within(container).getAllByRole("link");

    expect(links).toHaveLength(posts.length);

    expect(links[0]).toHaveAttribute("href", "/blog/some-post");
    expect(links[1]).toHaveAttribute("href", "/blog/some-other-post");
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <Curriculum pageData={testCurriculumPageData} />,
      );

      expect(seo).toEqual({});
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
