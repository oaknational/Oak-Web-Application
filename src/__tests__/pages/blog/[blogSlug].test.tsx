import { screen, waitFor } from "@testing-library/react";

import { BlogPost } from "../../../common-lib/cms-types";
import BlogSinglePage, {
  BlogSinglePageProps,
} from "../../../pages/blog/[blogSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    ...jest.requireActual("next/router").useRouter,
    asPath: "asPath test value",
    query: {},
    pathname: "/blog/[blogSlug]",
  }),
}));

jest.mock("@/components/HooksAndUtils/sanityImageBuilder", () => ({
  __esModule: true,
  imageBuilder: {
    image: function () {
      return this;
    },
    width: function () {
      return this;
    },
    height: function () {
      return this;
    },
    fit: function () {
      return this;
    },
    crop: function () {
      return this;
    },
    url: () => "www.example.com/img.png",
  },
}));

const testBlog: BlogPost = {
  title: "A blog",
  id: "5",
  date: new Date("2025-01-01"),
  slug: "a-blog",
  author: { id: "000", name: "Author McAuthorFace" },
  mainImage: {
    asset: {
      _id: "",
      url: "",
    },
  },
  summaryPortableText: "Lorem ipsum",
  contentPortableText: [],
  category: {
    title: "Lesson Plabning",
    slug: "lesson-planning",
  },
};

const testBlog2: BlogPost = {
  title: "Another blog",
  id: "6",
  date: new Date("2022-01-01"),
  slug: "another-blog",
  author: { id: "000", name: "Author McAuthorFace" },
  mainImage: {
    asset: {
      _id: "",
      url: "",
    },
  },
  summaryPortableText: "Lorem ipsum",
  contentPortableText: [],
  category: {
    title: "Lesson Plabning",
    slug: "lesson-planning",
  },
};

const testSerializedBlog = {
  ...testBlog,
  date: new Date().toISOString(),
};

const blogPosts = jest.fn(() => [testBlog, testBlog2]);
const blogPostBySlug = jest.fn(() => testBlog);

const render = renderWithProviders();

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

  describe("BlogSinglePage", () => {
    it("Renders title from props ", async () => {
      render(<BlogSinglePage blog={testSerializedBlog} categories={[]} />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "A blog",
        );
      });
    });

    describe.skip("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo()(
          <BlogSinglePage blog={testSerializedBlog} categories={[]} />,
        );

        expect(seo).toEqual({});
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all blogs", async () => {
      const { getStaticPaths } = await import("../../../pages/blog/[blogSlug]");

      const pathsResult = await getStaticPaths();

      expect(pathsResult.paths).toEqual([
        { params: { blogSlug: "a-blog" } },
        { params: { blogSlug: "another-blog" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct blog", async () => {
      const { getStaticProps } = await import("../../../pages/blog/[blogSlug]");
      await getStaticProps({
        params: { blogSlug: "another-blog" },
      });

      expect(blogPostBySlug).toHaveBeenCalledWith(
        "another-blog",
        expect.any(Object),
      );
    });

    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("../../../pages/blog/[blogSlug]");
      await getStaticProps({
        params: { blogSlug: "another-blog" },
      });

      expect(blogPostBySlug).toHaveBeenCalledWith("another-blog", {
        previewMode: false,
      });
    });

    it("Should fetch draft content in preview mode", async () => {
      const { getStaticProps } = await import("../../../pages/blog/[blogSlug]");
      await getStaticProps({
        params: { blogSlug: "another-blog" },
        preview: true,
      });

      expect(blogPostBySlug).toHaveBeenCalledWith("another-blog", {
        previewMode: true,
      });
    });

    it("Should format the blog date", async () => {
      const { getStaticProps } = await import("../../../pages/blog/[blogSlug]");
      const propsResult = (await getStaticProps({
        params: { blogSlug: "another-blog" },
      })) as { props: BlogSinglePageProps };

      expect(propsResult?.props?.blog).toMatchObject({
        date: "2025-01-01T00:00:00.000Z",
      });
    });

    it("should return notFound when a blog post is missing", async () => {
      blogPostBySlug.mockResolvedValueOnce(null as never);

      const { getStaticProps } = await import("../../../pages/blog/[blogSlug]");
      const propsResult = (await getStaticProps({
        params: { blogSlug: "another-blog" },
      })) as { props: BlogSinglePageProps };

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
