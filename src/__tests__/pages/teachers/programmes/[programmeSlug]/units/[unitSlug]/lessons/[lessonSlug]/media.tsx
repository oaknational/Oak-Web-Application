import React from "react";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import LessonMediaPage from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/media";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

const testCurriculumData = {
  lessonTitle: "Lesson Title",
  keyStageSlug: "ks1",
  subjectTitle: "Subject Title",
  subjectSlug: "subject-slug",
  programmeSlug: "programme-slug",
  unitSlug: "unit-slug",
  lessonSlug: "lesson-slug",
  unitTitle: "unit title",
};

describe("pages/teachers/lessons/[lessonSlug]/media", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(
      <LessonMediaPage curriculumData={testCurriculumData} />,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });
});
