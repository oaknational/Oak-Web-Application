import { screen, waitFor } from "@testing-library/react";

import PlanALesson from "../../pages/lesson-planning";
import { PlanningPage } from "../../node-lib/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import {
  mockImageAsset,
  mockVideoAsset,
  portableTextFromString,
} from "../__helpers__/cms";

const testPlanningPageData: PlanningPage = {
  id: "01",
  title: "Planning title",
  heading: "Planning heading",
  summaryPortableText: portableTextFromString("Planning summary"),
  lessonElements: {
    introQuiz: { title: "Intro quiz title" },
    video: { title: "Video title" },
    slides: { title: "Slides title" },
    worksheet: { title: "Worksheet title" },
    exitQuiz: { title: "Exit quiz title" },
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
};

const getPageData = jest.fn(() => testPlanningPageData);

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
  it("Renders correct title ", async () => {
    renderWithProviders(
      <PlanALesson pageData={testPlanningPageData} isPreviewMode={false} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Planning title"
      );
    });
  });
  it("uses correct src", async () => {
    const { getByAltText } = renderWithProviders(
      <PlanALesson pageData={testPlanningPageData} isPreviewMode={false} />
    );

    const image = getByAltText("planning illustration");
    expect(image).toHaveAttribute(
      "src",
      "/_next/image?url=%2Fimages%2Fillustrations%2Fplanning.png&w=3840&q=75"
    );
  });

  it("Should not fetch draft content by default", async () => {
    const { getStaticProps } = await import("../../pages/lesson-planning");
    await getStaticProps({
      params: {},
    });

    expect(getPageData).toHaveBeenCalledWith({
      previewMode: false,
    });
  });
});
