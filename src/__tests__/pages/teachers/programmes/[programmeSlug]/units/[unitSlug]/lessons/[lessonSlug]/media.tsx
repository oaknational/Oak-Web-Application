import React from "react";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import LessonMediaPage from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/media";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("pages/teachers/lessons/[lessonSlug]/media", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(<LessonMediaPage />);

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });
});
