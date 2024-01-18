import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { BlogPostPreview } from "../../../common-lib/cms-types";
import {
  SerializedBlogPostPreview,
  PostListingPageProps,
} from "../../../components/GenericPagesViews/BlogIndex.view";
import PostListingPage from "../../../pages/blog";
import { mockImageAsset, mockSeoResult } from "../../__helpers__/cms";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

const testPageData = {
  id: "123",
  title: "page title",
  heading: "page heading",
  summaryPortableText: [],
};

const testBlogPreview: BlogPostPreview = {
  title: "A blog",
  id: "5",
  slug: "a-blog",
  date: new Date("2021-12-01"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: "A blog summary",
  mainImage: mockImageAsset(),
  author: {
    id: "1",
    name: "name",
  },
};

const testSerializedBlogPreview: SerializedBlogPostPreview = {
  ...testBlogPreview,
  date: testBlogPreview.date.toISOString(),
};

const testBlogPreview2: BlogPostPreview = {
  title: "Another blog",
  id: "6",
  slug: "another-blog",
  date: new Date("2021-12-31"),
  category: { title: "Some category", slug: "some-category" },
  summaryPortableText: "Another blog summary",
  mainImage: mockImageAsset(),
  author: {
    id: "1",
    name: "name",
  },
};

const testSerializedBlogPreview2: SerializedBlogPostPreview = {
  ...testBlogPreview2,
  date: testBlogPreview2.date.toISOString(),
};

const blogPosts = vi.fn(() => [testBlogPreview, testBlogPreview2]);
const blogListingPage = vi.fn(() => testPageData);

const render = renderWithProviders();

vi.doMock("../../../node-lib/cms", () => ({
  __esModule: true,
  default: {
    blogPosts: blogPosts,
    blogListingPage: blogListingPage,
  },
}));

describe("pages/blog/index.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("PostListingPage", () => {
    it("Renders a link to each blog ", () => {
      render(
        <PostListingPage
          blogs={[testSerializedBlogPreview, testSerializedBlogPreview2]}
          pageData={testPageData}
          categories={[]}
          categorySlug={null}
        />,
      );

      expect(screen.getByText("A blog").closest("a")).toHaveAttribute(
        "href",
        "/blog/a-blog",
      );

      expect(screen.getByText("Another blog").closest("a")).toHaveAttribute(
        "href",
        "/blog/another-blog",
      );
    });

    describe("SEO", () => {
      it.skip("renders the correct SEO details from the CMS", () => {
        const { seo } = renderWithSeo()(
          <PostListingPage
            blogs={[testSerializedBlogPreview, testSerializedBlogPreview2]}
            pageData={{
              ...testPageData,
              seo: {
                title: "Blog SEO title",
                description: "Blog SEO description",
                canonicalURL: "https://example.com/blog",
              },
            }}
            categories={[]}
            categorySlug={null}
          />,
        );

        expect(seo).toMatchObject({
          title: "Blog SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Blog SEO title | NEXT_PUBLIC_SEO_APP_NAME",
          description: "Blog SEO description",
          ogDescription: "Blog SEO description",
          canonical: "https://example.com/blog",
        });
      });

      it.skip("renders the correct SEO fallbacks", () => {
        const { seo } = renderWithSeo()(
          <PostListingPage
            blogs={[testSerializedBlogPreview, testSerializedBlogPreview2]}
            pageData={testPageData}
            categories={[]}
            categorySlug={null}
          />,
        );

        expect(seo).toMatchObject({
          ...mockSeoResult,
          title: "Latest Blogs & Insights | NEXT_PUBLIC_SEO_APP_NAME",
          ogTitle: "Latest Blogs & Insights | NEXT_PUBLIC_SEO_APP_NAME",
          canonical: "NEXT_PUBLIC_SEO_APP_URL",
          description:
            "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
          ogDescription:
            "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
          ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
          ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        });
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should return the blogs from the CMS", async () => {
      const { getStaticProps } = await import("../../../pages/blog");

      const propsResult = (await getStaticProps({})) as {
        props: PostListingPageProps;
      };
      expect(propsResult?.props?.blogs).toEqual([
        testSerializedBlogPreview,
        testSerializedBlogPreview2,
      ]);
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("../../../pages/blog");

      await getStaticProps({});
      expect(blogPosts).toHaveBeenCalledWith({ previewMode: false });
      expect(blogListingPage).toHaveBeenCalledWith({ previewMode: false });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import("../../../pages/blog");
      await getStaticProps({ preview: true });

      expect(blogPosts).toHaveBeenCalledWith({ previewMode: true });
      expect(blogListingPage).toHaveBeenCalledWith({ previewMode: true });
    });
  });
});
