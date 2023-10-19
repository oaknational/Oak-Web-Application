import { screen } from "@testing-library/react";

import PlanALesson from "../../pages/lesson-planning";
import { CTA, PlanningPage } from "../../common-lib/cms-types";
import renderWithProviders from "../__helpers__/renderWithProviders";
import {
  mockImageAsset,
  mockSeo,
  mockVideoAsset,
  portableTextFromString,
} from "../__helpers__/cms";
import renderWithSeo from "../__helpers__/renderWithSeo";

const testPlanningPageData: PlanningPage = {
  id: "01",
  title: "Planning title",
  heading: "Planning heading",
  summaryPortableText: portableTextFromString("Planning summary"),
  lessonElements: {
    introQuiz: {
      title: "Starter quiz title",
      bodyPortableText: portableTextFromString("Intro quiz body"),
    },
    video: {
      title: "Video title",
      bodyPortableText: portableTextFromString("Video body"),
    },
    slides: {
      title: "Slides title",
      bodyPortableText: portableTextFromString("Slides body"),
    },
    worksheet: {
      title: "Worksheet title",
      bodyPortableText: portableTextFromString("Worksheet body"),
    },
    exitQuiz: {
      title: "Exit quiz title",
      bodyPortableText: portableTextFromString("Exit quiz body"),
    },
  },
  lessonElementsCTA: {
    label: "elements label",
    linkType: "external",
    external: "https://example.com",
  },
  stepsHeading: "steps",
  steps: [
    {
      title: "step one",
      bodyPortableText: portableTextFromString("step one body"),
    },
  ],
  stepsCTA: {
    label: "Steps CTA",
    linkType: "internal",
    internal: {
      id: "homepage",
      contentType: "homepage",
    },
  },
  learnMoreHeading: "learn more heading",
  learnMoreBlock1: {
    title: "learn more block 1",
    bodyPortableText: portableTextFromString("block 1 text"),
    alignMedia: "left",
    mediaType: "video",
    video: mockVideoAsset(),
  },
  learnMoreBlock2: {
    title: "learn more block 2",
    bodyPortableText: portableTextFromString("block 2 text"),
    alignMedia: "left",
    mediaType: "image",
    image: mockImageAsset("block2"),
  },
  seo: mockSeo(),
};

const testInternalLessonElementsCta: CTA = {
  linkType: "internal",
  label: "internal cta",
  internal: { contentType: "aboutCorePage.whoWeAre", id: "1" },
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

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Planning title",
    );
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <PlanALesson pageData={testPlanningPageData} />,
      );

      expect(seo).toEqual({});
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

  describe("CTA links", () => {
    it.todo("should use pageData for the search CTA");
    it("should use pageData for lesson elements CTA", () => {
      render(<PlanALesson pageData={testPlanningPageData} />);
      const lessonElementsCta = screen.getAllByRole("link", {
        name: testPlanningPageData.lessonElementsCTA.label,
      });
      const externalLink =
        testPlanningPageData.lessonElementsCTA.linkType === "external"
          ? testPlanningPageData.lessonElementsCTA.external
          : null;
      if (!externalLink) {
        throw new Error("This should never happen - check the test data");
      }
      expect(lessonElementsCta[0]).toHaveAttribute("href", externalLink);
    });
    it("should open external links in a new tab", () => {
      render(<PlanALesson pageData={testPlanningPageData} />);
      const lessonElementsCta = screen.getAllByRole("link", {
        name: testPlanningPageData.lessonElementsCTA.label,
      });
      const externalLink =
        testPlanningPageData.lessonElementsCTA.linkType === "external"
          ? testPlanningPageData.lessonElementsCTA.external
          : null;
      if (!externalLink) {
        throw new Error("This should never happen - check the test data");
      }
      expect(lessonElementsCta[0]).toHaveAttribute("target", "_blank");
    });
    it("should link to internal pages", () => {
      render(
        <PlanALesson
          pageData={{
            ...testPlanningPageData,
            lessonElementsCTA: testInternalLessonElementsCta,
          }}
        />,
      );
      const lessonElementsCta = screen.getAllByRole("link", {
        name: testInternalLessonElementsCta.label,
      });
      expect(lessonElementsCta[0]).toHaveAttribute(
        "href",
        "/about-us/who-we-are",
      );
    });
    it("should open internal pages in the same tab", () => {
      render(
        <PlanALesson
          pageData={{
            ...testPlanningPageData,
            lessonElementsCTA: testInternalLessonElementsCta,
          }}
        />,
      );
      const lessonElementsCta = screen.getAllByRole("link", {
        name: testInternalLessonElementsCta.label,
      });
      expect(lessonElementsCta[0]).not.toHaveAttribute("target", "_blank");
    });
  });
});
