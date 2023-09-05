import { getByRole, screen, within } from "@testing-library/react";

import Home, {
  getStaticProps,
  HomePageProps,
  SerializedPost,
} from "../../pages";
import CMSClient from "../../node-lib/cms";
import {
  BlogPostPreview,
  HomePage,
  WebinarPreview,
} from "../../common-lib/cms-types";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";
import { mockSeo, portableTextFromString } from "../__helpers__/cms";

jest.mock("../../node-lib/cms");

const render = renderWithProviders();

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const pageData = {
  id: "homepage",
  heading: "Oak",
  summaryPortableText: portableTextFromString("Here's the page summary"),
  notification: {
    enabled: true,
    heading: "Read this news!",
    link: {
      linkType: "external",
      external: "https://example.com",
    },
  },
} as unknown as HomePage;

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/index.tsx", () => {
  it("Renders correct title and summary", () => {
    render(<Home pageData={pageData} posts={[]} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Oak");

    const firstH2 = screen.getAllByRole("heading", { level: 2 })[0];
    expect(firstH2).toHaveTextContent("Here's the page summary");
  });

  it("Renders the notification when enabled", () => {
    render(<Home pageData={pageData} posts={[]} />);

    expect(screen.queryByText("Read this news!")).toBeInTheDocument();
  });

  it("Does not render the notification when disabled", () => {
    const disabledNotificationPageData = {
      ...pageData,
      notification: { ...pageData.notification, enabled: false },
    } as HomePage;
    render(<Home pageData={disabledNotificationPageData} posts={[]} />);

    expect(screen.queryByText("Read this news!")).not.toBeInTheDocument();
  });

  it("Renders a link to the blog list", () => {
    render(<Home pageData={pageData} posts={[]} />);

    const blogLink = screen.getByText("All blogs");
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute("href", "/blog");
  });

  it("Renders the provided blog posts", async () => {
    const mockPosts = [
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

    render(<Home pageData={pageData} posts={mockPosts} />);

    const list = screen
      .getAllByRole("list")
      .find((list) => list.textContent?.includes("Some blog post"));

    expect(list).toBeInTheDocument();

    const { getAllByRole } = within(list as HTMLElement);
    const items = getAllByRole("listitem");

    expect(items).toHaveLength(2);

    expect(
      getByRole(items[0] as HTMLElement, "link", {
        name: "Some blog post",
      })
    ).toHaveAttribute("href", "/blog/some-blog-post");
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <Home pageData={{ ...pageData, seo: undefined }} posts={[]} />
      );

      expect(seo).toEqual({});
    });

    it("renders the correct SEO details from the CMS", () => {
      const { seo } = renderWithSeo()(
        <Home pageData={{ ...pageData, seo: mockSeo() }} posts={[]} />
      );

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

    it("Should filter out upcoming webinars", async () => {
      mockCMSClient.webinars.mockResolvedValueOnce([
        { ...mockPost3, id: "2", date: new Date("2022-01-01") },
        { ...mockPost3, id: "3", date: new Date("2021-01-01") },
        { ...mockPost3, id: "1", date: new Date("4023-01-01") },
      ]);
      const result = (await getStaticProps({})) as { props: HomePageProps };

      const postIds = result.props.posts.map((p) => p.id);
      expect(postIds).toEqual(["2", "3"]);
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
