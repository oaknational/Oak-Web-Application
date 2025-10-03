import Home, { getStaticProps, HomePageProps } from "@/pages/index";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import { BlogPostPreview, WebinarPreview } from "@/common-lib/cms-types";

const render = renderWithProviders();

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

const props: HomePageProps = {
  pageData: {
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
  },
  posts: mockPosts,
  curriculumData: {
    keyStages: keyStageKeypad.keyStages,
  },
};

const homepage = jest.fn().mockResolvedValue(props.pageData);
const blogPosts = jest.fn().mockResolvedValue([]);
const webinars = jest.fn().mockResolvedValue([]);

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    homepage: (...args: []) => homepage(args),
    webinars: (...args: []) => webinars(args),
    blogPosts: (...args: []) => blogPosts(args),
  },
}));

describe("Teachers Page", () => {
  describe("Page component", () => {
    it("renders", () => {
      render(<Home {...props} />);
    });
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
    });

    it("Should return no more than 4 posts", async () => {
      blogPosts.mockResolvedValueOnce([
        mockPost,
        mockPost2,
        mockPost,
        mockPost2,
        mockPost,
        mockPost2,
      ]);
      const result = (await getStaticProps({
        params: {},
      })) as { props: HomePageProps };

      expect(result.props?.posts).toHaveLength(4);
    });

    it("Should sort posts by date ascending", async () => {
      blogPosts.mockResolvedValueOnce([
        { ...mockPost, id: "2", date: new Date("2022-01-01") },
        { ...mockPost, id: "3", date: new Date("2021-01-01") },
        { ...mockPost, id: "1", date: new Date("2023-01-01") },
      ]);
      const result = (await getStaticProps({
        params: {},
      })) as { props: HomePageProps };

      const postIds = result.props.posts.map((p) => p.id);
      expect(postIds).toEqual(["1", "2", "3"]);
    });

    it("Should filter out upcoming webinars", async () => {
      webinars.mockResolvedValueOnce([
        { ...mockPost3, id: "2", date: new Date("2022-01-01") },
        { ...mockPost3, id: "3", date: new Date("2021-01-01") },
        { ...mockPost3, id: "1", date: new Date("4023-01-01") },
      ]);
      const result = (await getStaticProps({
        params: {},
      })) as { props: HomePageProps };

      const postIds = result.props.posts.map((p) => p.id as string);
      expect(postIds).toEqual(["2", "3"]);
    });

    it("Should not fetch draft content by default", async () => {
      blogPosts.mockResolvedValueOnce([mockPost]);
      await getStaticProps({
        params: {},
      });

      expect(blogPosts).toHaveBeenCalledWith([
        expect.objectContaining({
          previewMode: false,
        }),
      ]);
    });

    it("should return notFound when the page data is missing", async () => {
      homepage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
