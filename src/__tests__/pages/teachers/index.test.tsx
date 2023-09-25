import { screen, within, getByRole, fireEvent } from "@testing-library/react";

import { HomePageProps, SerializedPost, getStaticProps } from "@/pages";
import CMSClient from "@/node-lib/cms";
import { BlogPostPreview, WebinarPreview } from "@/common-lib/cms-types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import Teachers, { TeachersHomePageProps } from "@/pages/teachers";

jest.mock("src/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;
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

const render = renderWithProviders();

describe("pages/teachers/index.tsx", () => {
  it("Renders correct title ", () => {
    render(<Teachers {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Teachers");
  });
  it("Render correct tab after selecting tab", () => {
    const { getByTitle, getAllByTitle } = render(<Teachers {...props} />);
    const curriculumPlans = getAllByTitle("Curriculum plans");
    const curriculumPlansButton = curriculumPlans[1];
    if (curriculumPlansButton) {
      fireEvent.click(curriculumPlansButton);
      const curriculumH1 = screen.getByRole("heading", { level: 1 });
      expect(curriculumH1).toHaveTextContent("Teachers & subject leads");
    } else {
      throw new Error("Could not find curriculum plans button element");
    }

    fireEvent.click(getByTitle("Pupils"));
    const pupilsH1 = screen.getByRole("heading", { level: 1 });
    expect(pupilsH1).toHaveTextContent("Pupils");

    fireEvent.click(getByTitle("Teaching resources"));
    const teachersH1 = screen.getByRole("heading", { level: 1 });
    expect(teachersH1).toHaveTextContent("Teachers");
  });
  it("Renders a link to the blog list", () => {
    render(<Teachers {...props} />);

    const blogLink = screen.getByText("All blogs");
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute("href", "/blog");
  });

  it("Renders the provided blog posts", async () => {
    render(<Teachers {...props} />);

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
      }),
    ).toHaveAttribute("href", "/blog/some-blog-post");
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
      })) as { props: HomePageProps };

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
      })) as { props: HomePageProps };

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
      })) as { props: HomePageProps };

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
