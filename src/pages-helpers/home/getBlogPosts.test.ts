import { getBlogPosts, getPropsFunction } from "./getBlogPosts";

import {
  BlogPostPreview,
  HomePage,
  WebinarPreview,
} from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";

jest.mock("src/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const pageData: HomePage = {
  heading: "",
  id: "",
  summaryPortableText: [],
  campaignPromoBanner: {
    headingPortableTextWithPromo: [],
    subheadingPortableTextWithPromo: [],
    media: [],
    buttonCta: "",
  },
  notification: { enabled: false },
  sidebarCard1: { title: "", bodyPortableText: [] },
  sidebarCard2: { title: "", bodyPortableText: [] },
  testimonials: [],
};

const mockPost = {
  id: "1",
  title: "Some blog post",
  slug: "some-blog-post",
  date: new Date("2022-12-01"),
  category: { title: "Some category", slug: "some-category" },
} as BlogPostPreview;

const mockPost2 = {
  id: "2",
  title: "Some other post",
  slug: "some-other-post",
  date: new Date("2022-12-01"),
  category: { title: "Some category", slug: "some-category" },
} as BlogPostPreview;

const mockPost3 = {
  id: "2",
  title: "Some other post",
  slug: "some-other-post",
  date: new Date("2022-12-01"),
  category: { title: "Some category", slug: "some-category" },
} as WebinarPreview;

describe("getBlogPosts", () => {
  describe("getBlogPosts", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();

      mockCMSClient.homepage.mockResolvedValue(pageData);
      mockCMSClient.blogPosts.mockResolvedValue([]);
      mockCMSClient.webinars.mockResolvedValue([]);
    });

    it("Should return no more than 4 posts", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([
        mockPost,
        mockPost2,
        mockPost,
        mockPost2,
        mockPost,
        mockPost2,
      ]);

      const result = await getBlogPosts(false, 5);
      expect(result.posts).toHaveLength(4);
    });

    it("Should sort posts by date ascending", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([
        { ...mockPost, id: "2", date: new Date("2022-01-01") },
        { ...mockPost, id: "3", date: new Date("2021-01-01") },
        { ...mockPost, id: "1", date: new Date("2023-01-01") },
      ]);
      const result = await getBlogPosts(false, 5);
      const postIds = result.posts.map((p) => p.id);
      expect(postIds).toEqual(["1", "2", "3"]);
    });

    it("Should filter out upcoming webinars", async () => {
      mockCMSClient.webinars.mockResolvedValueOnce([
        { ...mockPost3, id: "2", date: new Date("2022-01-01") },
        { ...mockPost3, id: "3", date: new Date("2021-01-01") },
        { ...mockPost3, id: "1", date: new Date("4023-01-01") },
      ]);
      const result = await getBlogPosts(false, 5);

      const postIds = result.posts.map((p) => p.id as string);
      expect(postIds).toEqual(["2", "3"]);
    });

    it("Should not fetch draft content by default", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([mockPost]);
      await getBlogPosts(false, 5);

      expect(mockCMSClient.blogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          previewMode: false,
        }),
      );
    });

    it("should return null when the page data is missing", async () => {
      mockCMSClient.homepage.mockResolvedValueOnce(null);

      const propsResult = await getBlogPosts(false, 5);

      expect(propsResult.pageData).toBeNull();
    });
  });

  describe("getPropsFunction", () => {
    it("Should return notFound when page data is missing", async () => {
      mockCMSClient.homepage.mockResolvedValueOnce(null);

      const propsFunction = getPropsFunction({});

      const result = await propsFunction();

      expect(result).toEqual({ notFound: true });
    });
  });
});
