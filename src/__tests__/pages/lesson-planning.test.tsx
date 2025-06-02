import { screen } from "@testing-library/react";

import PlanALesson, { getStaticProps } from "../../pages/lesson-planning";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

import { testPlanALessonPageData } from "./lesson-planning.fixture";

import CMSClient from "@/node-lib/cms";
import { BlogPostPreview } from "@/common-lib/cms-types";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testPlanningPageData = { ...testPlanALessonPageData };
const getPageData = jest.fn(() => testPlanningPageData);

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

const render = renderWithProviders();

describe("pages/lesson-planning.tsx", () => {
  beforeAll(() => {
    //mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("Renders header hero component", () => {
    const { getByRole } = render(
      <PlanALesson pageData={testPlanningPageData} posts={mockPosts} />,
    );
    expect(getByRole("heading", { name: "test" })).toBeInTheDocument();
  });

  it("Renders a nav", () => {
    render(<PlanALesson pageData={testPlanningPageData} posts={mockPosts} />);
    const nav = screen.getByRole("navigation", {
      name: "plan a lesson contents",
    });
    expect(screen.getAllByText("Contents")).toHaveLength(2);
    expect(nav).toBeInTheDocument();
  });

  it("applies correct margin-bottom size based on section position if its a form block", () => {
    render(<PlanALesson pageData={testPlanningPageData} posts={mockPosts} />);

    const sections = screen.getAllByTestId("lesson-section");

    expect(sections[0]).toHaveStyle("margin-bottom: 5rem");
    expect(sections[1]).toHaveStyle("margin-bottom: 5rem");

    expect(sections[sections.length - 1]).toHaveStyle("margin-bottom: 2rem");
  });

  it("applies correct margin-bottom size based on section position if its a content block", () => {
    render(
      <PlanALesson
        pageData={{
          ...testPlanningPageData,
          content: [...testPlanALessonPageData.content].reverse(),
        }}
        posts={mockPosts}
      />,
    );

    const sections = screen.getAllByTestId("lesson-section");

    expect(sections[0]).toHaveStyle("margin-bottom: 5rem");
    expect(sections[1]).toHaveStyle("margin-bottom: 5rem");

    expect(sections[sections.length - 1]).toHaveStyle("margin-bottom: 2rem");
  });

  it("Renders the header hero with optional props", () => {
    render(
      <PlanALesson pageData={testPlanALessonPageData} posts={mockPosts} />,
    );

    expect(
      screen.getByAltText(
        `${testPlanALessonPageData.hero.author.name} profile picture`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(testPlanALessonPageData.hero.image?.altText ?? ""),
    ).toBeInTheDocument();
  });
  it("Renders the header hero without author", () => {
    render(
      <PlanALesson
        pageData={{
          ...testPlanALessonPageData,
          hero: {
            ...testPlanALessonPageData.hero,
            author: { ...testPlanALessonPageData.hero.author, image: null },
          },
        }}
        posts={mockPosts}
      />,
    );

    expect(
      screen.queryByAltText(
        `${testPlanALessonPageData.hero.author.name} profile picture`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByAltText(testPlanALessonPageData.hero.image?.altText ?? ""),
    ).toBeInTheDocument();
  });

  it("Renders the author title if it exists", () => {
    render(
      <PlanALesson
        pageData={{
          ...testPlanALessonPageData,
          hero: {
            ...testPlanALessonPageData.hero,
            author: {
              id: "13719a7b-4f00-4816-883a-8aded2a5c703",
              name: "Katie Marl",
              image: {
                asset: {
                  _id: "image-586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256-png",
                  url: "https://cdn.sanity.io/images/cuvjke51/production/586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256.png",
                },
                hotspot: null,
              },
              bioPortableText: null,
              socials: null,
            },
          },
        }}
        posts={mockPosts}
      />,
    );

    expect(
      screen.queryByText("Primary Curriculum Design Lead"),
    ).not.toBeInTheDocument();
  });

  it("renders a hero image with alt text", () => {
    console.log({ mockPosts });

    render(
      <PlanALesson pageData={testPlanALessonPageData} posts={mockPosts} />,
    );

    const heroImage = screen.getByAltText("alt text hero").closest("img");
    expect(heroImage).toBeInTheDocument();
  });

  describe("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <PlanALesson pageData={testPlanningPageData} posts={mockPosts} />,
      );

      expect(seo).toEqual({
        title: "test | NEXT_PUBLIC_SEO_APP_NAME",
        description: "test",
        ogTitle: "test | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "test",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        ogImage:
          "NEXT_PUBLIC_SEO_APP_URL/images/sharing/default-social-sharing-2022.png?" +
          new Date().getFullYear(),
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
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

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();

      mockCMSClient.planALessonPage.mockResolvedValue(testPlanningPageData);
      mockCMSClient.blogPosts.mockResolvedValue([]);
      mockCMSClient.webinars.mockResolvedValue([]);
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
      getPageData.mockResolvedValueOnce(null as never);
      mockCMSClient.planALessonPage.mockResolvedValueOnce(null);

      const { getStaticProps } = await import("../../pages/lesson-planning");
      const propsResult = await getStaticProps({
        params: {},
      });
      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
