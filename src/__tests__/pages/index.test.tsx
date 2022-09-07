import { getByRole, screen, waitFor, within } from "@testing-library/react";

import Home, {
  getStaticProps,
  HomePageProps,
  SerializedPost,
} from "../../pages";
import CMSClient, { BlogPostPreview, HomePage } from "../../node-lib/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";
import { portableTextFromString } from "../__helpers__/cms";

jest.mock("../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const pageData = {
  id: "homepage",
  heading: "Oak",
  summaryPortableText: portableTextFromString("Here's the page summary"),
} as HomePage;

describe("pages/index.tsx", () => {
  it("Renders correct title and summary", async () => {
    renderWithProviders(
      <Home pageData={pageData} posts={[]} isPreviewMode={false} />
    );

    await waitFor(() => {
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Oak");

      const firstH2 = screen.getAllByRole("heading", { level: 2 })[0];
      expect(firstH2).toHaveTextContent("Here's the page summary");
    });
  });

  it("Renders a link to the blog list", async () => {
    renderWithProviders(
      <Home pageData={pageData} posts={[]} isPreviewMode={false} />
    );

    await waitFor(() => {
      const blogLink = screen.getByText("All blogs");
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");
    });
  });

  it("Renders the provided blog posts", async () => {
    const mockPosts = [
      {
        id: "1",
        type: "blog-post",
        title: "Some blog post",
        slug: "some-blog-post",
        date: new Date("2022-12-01").toISOString(),
        category: { title: "Some category", slug: "some-category" },
      },
      {
        id: "2",
        type: "blog-post",
        title: "Some other post",
        slug: "some-other-post",
        date: new Date("2022-12-01").toISOString(),
        category: { title: "Some category", slug: "some-category" },
      },
    ] as SerializedPost[];

    renderWithProviders(
      <Home pageData={pageData} posts={mockPosts} isPreviewMode={false} />
    );

    await waitFor(() => {
      const list = screen
        .getAllByRole("list")
        .find((list) => list.textContent?.includes("Some blog post"));

      expect(list).toBeInTheDocument();

      const { getAllByRole } = within(list as HTMLElement);
      const items = getAllByRole("listitem");

      expect(items).toHaveLength(2);

      expect(getByRole(items[0] as HTMLElement, "link")).toHaveAttribute(
        "href",
        "/blog/some-blog-post"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<Home posts={[]} isPreviewMode={false} />);

      expect(seo).toEqual({});
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

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();

      mockCMSClient.homepage.mockResolvedValue(pageData);
      mockCMSClient.blogPosts.mockResolvedValue([]);
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
      const result = (await getStaticProps({})) as { props: HomePageProps };

      expect(result.props?.posts).toHaveLength(4);
    });

    it("Should sort posts by date ascending", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([
        { ...mockPost, id: "2", date: new Date("2022-01-01") },
        { ...mockPost, id: "3", date: new Date("2021-01-01") },
        { ...mockPost, id: "1", date: new Date("2023-01-01") },
      ]);
      const result = (await getStaticProps({})) as { props: HomePageProps };

      const postIds = result.props.posts.map((p) => p.id);
      expect(postIds).toEqual(["1", "2", "3"]);
    });

    it("Should not fetch draft content by default", async () => {
      mockCMSClient.blogPosts.mockResolvedValueOnce([mockPost]);
      await getStaticProps({});

      expect(mockCMSClient.blogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          previewMode: false,
        })
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
