import { screen, waitFor } from "@testing-library/react";

import Planning from "../../pages/planning";
import { PlanningPage } from "../../node-lib/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import { portableTextFromString } from "../__helpers__/cms";

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
  lessonElementsCTA: { label: "elements label" },
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
  },
  learnMoreBlock2: {
    title: "learn more block 2",
    bodyPortableText: portableTextFromString("block 2 text"),
  },
};

describe("pages/planning.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<Planning pageData={testPlanningPageData} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Planning heading"
      );
    });
  });
});
