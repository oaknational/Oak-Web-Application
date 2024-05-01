import { screen } from "@testing-library/react";

import PlanALesson from "../../pages/lesson-planning-lesq-783";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

import { testPlanningPageData } from "./lesson-planning.test";

const getPageData = jest.fn(() => testPlanningPageData);

const render = renderWithProviders();

describe("pages/lesson-planning.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../src/node-lib/cms/", () => ({
      __esModule: true,
      default: {
        planningPage: jest.fn(getPageData),
      },
    }));
  });

  it("Renders correct title ", () => {
    render(<PlanALesson pageData={testPlanningPageData} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("hero");
  });

  describe("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <PlanALesson pageData={testPlanningPageData} />,
      );

      expect(seo).toEqual({
        canonical: undefined,
        description: "Mock page description",
        ogDescription: "Mock page description",
        ogImage:
          "NEXT_PUBLIC_SEO_APP_URL/images/sharing/default-social-sharing-2022.png?2024",
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        ogTitle: "Mock Page Title | NEXT_PUBLIC_SEO_APP_NAME",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
        title: "Mock Page Title | NEXT_PUBLIC_SEO_APP_NAME",
      });
    });
  });

  describe("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import("../../pages/lesson-planning");
      await getStaticProps({
        params: {},
      });

      expect(getPageData).toHaveBeenCalledWith({
        previewMode: false,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      getPageData.mockResolvedValueOnce(null as never);

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
