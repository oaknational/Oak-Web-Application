import { screen } from "@testing-library/react";

import PlanALesson from "../../pages/lesson-planning-new";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

import { NewPlanningPage } from "@/common-lib/cms-types";

const testPlanningPageData: NewPlanningPage = {
  id: "1",
  hero: {
    title: "a title",
    heading: "a heading",
  },
  content: [
    {
      type: "LandingPageTextBlock",
      title: "A title",
    },
  ],
  seo: null,
};

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
    it.skip("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <PlanALesson pageData={testPlanningPageData} />,
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      const { getStaticProps } = await import(
        "../../pages/lesson-planning-new"
      );
      await getStaticProps({
        params: {},
      });

      expect(getPageData).toHaveBeenCalledWith({
        previewMode: false,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      getPageData.mockResolvedValueOnce(null as never);

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
