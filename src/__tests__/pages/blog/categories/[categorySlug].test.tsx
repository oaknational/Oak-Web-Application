import { Webinar } from "../../../../common-lib/cms-types";

const testBlog = {
  slug: "a-blog",
  category: { title: "Some category", slug: "some-blog-category" },
} as Webinar;

const testBlog2 = {
  slug: "another-blog",
  category: { title: "Some other category", slug: "some-other-category" },
} as Webinar;

const blogPosts = vi.fn(() => [testBlog, testBlog2]);

describe("pages/blog/categories/[categorySlug].tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.mock("../../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        blogPosts: vi.fn(blogPosts),
      },
    }));
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all blog categories", async () => {
      const { getStaticPaths } = await import(
        "../../../../pages/blog/categories/[categorySlug]"
      );

      const pathsResult = await getStaticPaths();

      expect(pathsResult.paths).toEqual([
        { params: { categorySlug: "some-blog-category" } },
        { params: { categorySlug: "some-other-category" } },
      ]);
    });
  });
});
