import { screen, waitFor } from "@testing-library/react";

import { BlogPost } from "../../../node-lib/cms";
import BlogDetailPage, { BlogPageProps } from "../../../pages/blogs/[blogSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";

const testBlog: BlogPost = {
  title: "A blog",
  id: "5",
  date: new Date("2025-01-01"),
  slug: "a-blog",
  author: { id: "000", name: "Author McAuthorFace" },
  contentPortableText: [],
};

const testBlog2: BlogPost = {
  title: "Another blog",
  id: "6",
  date: new Date("2022-01-01"),
  slug: "another-blog",
  author: { id: "000", name: "Author McAuthorFace" },
  contentPortableText: [],
};

const testSerializedBlog = {
  ...testBlog,
  date: new Date().toISOString(),
};

const blogPosts = jest.fn(() => [testBlog, testBlog2]);
const blogPostBySlug = jest.fn(() => testBlog);

describe("pages/blog/[blogSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        blogPosts: jest.fn(blogPosts),
        blogPostBySlug: jest.fn(blogPostBySlug),
      },
    }));
  });

  describe("BlogDetailPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(
        <BlogDetailPage blog={testSerializedBlog} isPreviewMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "A blog"
        );
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all blogs", async () => {
      const { getStaticPaths } = await import(
        "../../../pages/blogs/[blogSlug]"
      );

      const pathsResult = await getStaticPaths({});

      expect(pathsResult.paths).toEqual([
        { params: { blogSlug: "a-blog" } },
        { params: { blogSlug: "another-blog" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct blog", async () => {
      const { getStaticProps } = await import(
        "../../../pages/blogs/[blogSlug]"
      );
      await getStaticProps({
        params: { blogSlug: "another-blog" },
      });

      expect(blogPostBySlug).toHaveBeenCalledWith(
        "another-blog",
        expect.any(Object)
      );
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../../pages/blogs/[blogSlug]"
      );
      await getStaticProps({
        params: { blogSlug: "another-blog" },
      });

      expect(blogPostBySlug).toHaveBeenCalledWith("another-blog", {
        previewMode: false,
      });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import(
        "../../../pages/blogs/[blogSlug]"
      );
      await getStaticProps({
        params: { blogSlug: "another-blog" },
        preview: true,
      });

      expect(blogPostBySlug).toHaveBeenCalledWith("another-blog", {
        previewMode: true,
      });
    });

    it("Should format the blog date", async () => {
      const { getStaticProps } = await import(
        "../../../pages/blogs/[blogSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { blogSlug: "another-blog" },
      })) as { props: BlogPageProps };

      expect(propsResult?.props?.blog).toMatchObject({
        date: "2025-01-01T00:00:00.000Z",
      });
    });
  });
});
