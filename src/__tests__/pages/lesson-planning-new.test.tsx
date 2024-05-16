import { screen } from "@testing-library/react";

import PlanALesson, { getStaticProps } from "../../pages/lesson-planning-new";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

import { mockPosts } from "./index.test";
import { testPlanALessonPageData } from "./lesson-planning.fixture";

import CMSClient from "@/node-lib/cms";
import { BlogPostPreview } from "@/common-lib/cms-types";

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testPlanningPageData = testPlanALessonPageData;
const getPageData = jest.fn(() => testPlanningPageData);

const render = renderWithProviders();

describe("pages/lesson-planning.tsx", () => {
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

  describe("SEO", () => {
    it.skip("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <PlanALesson pageData={testPlanningPageData} posts={mockPosts} />,
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

      const { getStaticProps } = await import(
        "../../pages/lesson-planning-new"
      );
      const propsResult = await getStaticProps({
        params: {},
      });
      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
