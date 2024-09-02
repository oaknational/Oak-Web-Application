import { screen } from "@testing-library/react";

import Teachers, { getStaticProps } from "@/pages/index";
import CMSClient from "@/node-lib/cms";
import { BlogPostPreview, WebinarPreview } from "@/common-lib/cms-types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import { SerializedPost } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import { TeachersHomePageProps } from "@/pages/teachers";

jest.mock("src/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;
export const mockPosts = [
  {
    id: "1",
    type: "blog-post",
    title: "Some blog post",
    slug: "some-blog-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
  {
    id: "2",
    type: "blog-post",
    title: "Some other post",
    slug: "some-other-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
] as SerializedPost[];
const props: TeachersHomePageProps = {
  pageData: {
    heading: "",
    id: "",
    summaryPortableText: [],
    notification: { enabled: false },
    sidebarCard1: { title: "", bodyPortableText: [] },
    sidebarCard2: { title: "", bodyPortableText: [] },
  },
  posts: mockPosts,
  curriculumData: {
    keyStages: keyStageKeypad.keyStages,
  },
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const render = renderWithProviders();

describe("pages/index.tsx", () => {
  it("Renders correct title ", () => {
    render(<Teachers {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Teachers");
  });

  describe("getStaticProps", () => {
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

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();

      mockCMSClient.homepage.mockResolvedValue(props.pageData);
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
      const result = (await getStaticProps({
        params: {},
      })) as { props: TeachersHomePageProps };

      expect(result.props?.posts).toHaveLength(4);
    });

    it("Should sort posts by date ascending", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([
        { ...mockPost, id: "2", date: new Date("2022-01-01") },
        { ...mockPost, id: "3", date: new Date("2021-01-01") },
        { ...mockPost, id: "1", date: new Date("2023-01-01") },
      ]);
      const result = (await getStaticProps({
        params: {},
      })) as { props: TeachersHomePageProps };

      const postIds = result.props.posts.map((p) => p.id);
      expect(postIds).toEqual(["1", "2", "3"]);
    });

    it("Should filter out upcoming webinars", async () => {
      mockCMSClient.webinars.mockResolvedValueOnce([
        { ...mockPost3, id: "2", date: new Date("2022-01-01") },
        { ...mockPost3, id: "3", date: new Date("2021-01-01") },
        { ...mockPost3, id: "1", date: new Date("4023-01-01") },
      ]);
      const result = (await getStaticProps({
        params: {},
      })) as { props: TeachersHomePageProps };

      const postIds = result.props.posts.map((p) => p.id as string);
      expect(postIds).toEqual(["2", "3"]);
    });

    it("Should not fetch draft content by default", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([mockPost]);
      await getStaticProps({
        params: {},
      });

      expect(mockCMSClient.blogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          previewMode: false,
        }),
      );
    });

    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.homepage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
