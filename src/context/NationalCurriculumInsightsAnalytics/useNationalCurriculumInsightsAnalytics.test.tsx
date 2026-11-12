import { act, renderHook } from "@testing-library/react";

import { useNationalCurriculumInsightsAnalytics } from "./useNationalCurriculumInsightsAnalytics";

it("keeps standalone Storybook previews usable without a page analytics provider", () => {
  const previousStorybook = process.env.STORYBOOK;
  try {
    process.env.STORYBOOK = "true";
    const { result } = renderHook(() =>
      useNationalCurriculumInsightsAnalytics(),
    );
    expect(() =>
      act(() => {
        result.current.trackCtaClicked({
          ctaId: "hero-cta",
          ctaText: "Read guidance",
          ctaAction: "navigate",
          componentType: "national_curriculum",
          sectionId: "hero",
          sectionType: "hero",
        });
        result.current.trackScrolledTo("teacher-checklist");
      }),
    ).not.toThrow();
  } finally {
    if (previousStorybook === undefined) delete process.env.STORYBOOK;
    else process.env.STORYBOOK = previousStorybook;
  }
});
