import { screen } from "@testing-library/react";

import PlanALesson from "../../pages/lesson-planning-new";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

import { mockPosts } from "./index.test";
import { testPlanALessonPageData } from "./lesson-planning.fixture";

import CMSClient from "@/node-lib/cms";

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testPlanningPageData = testPlanALessonPageData;
const getPageData = jest.fn(() => testPlanningPageData);

const render = renderWithProviders();

describe("pages/lesson-planning.tsx", () => {
  it.skip("Renders correct title ", () => {
    render(<PlanALesson pageData={testPlanningPageData} posts={mockPosts} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("hero");
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

  describe.skip("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../pages/lesson-planning-new"
      );
      await getStaticProps({
        params: {},
      });

      expect(mockCMSClient.planALessonPage).toHaveBeenCalledWith({
        previewMode: false,
      });
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
