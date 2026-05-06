import { buildOverviewSectionItems } from "./buildOverviewSectionItems";

import { LessonReviewSection } from "@/components/PupilComponents/LessonEngineProvider";

describe("buildOverviewSectionItems", () => {
  it("builds section items with progress, hrefs and quiz metadata", () => {
    const onSectionClick = jest.fn();
    const getSectionHref = jest.fn(
      (section: LessonReviewSection) => `/lesson/${section}`,
    );

    const items = buildOverviewSectionItems({
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
      sectionResults: {
        intro: { isComplete: true },
        "starter-quiz": { isComplete: false, grade: 2, numQuestions: 3 },
      },
      isReadOnly: false,
      isHydratingInitialProgress: true,
      starterQuizNumQuestions: 3,
      exitQuizNumQuestions: 4,
      onSectionClick,
      getSectionHref,
    });

    expect(items).toEqual([
      {
        section: "intro",
        href: "/lesson/intro",
        progress: "complete",
        isLoading: true,
        onClick: expect.any(Function),
      },
      {
        section: "starter-quiz",
        href: "/lesson/starter-quiz",
        progress: "in-progress",
        numQuestions: 3,
        grade: 2,
        disabled: false,
        isLoading: true,
        onClick: expect.any(Function),
      },
      {
        section: "video",
        href: "/lesson/video",
        progress: "not-started",
        isLoading: true,
        onClick: expect.any(Function),
      },
      {
        section: "exit-quiz",
        href: "/lesson/exit-quiz",
        progress: "not-started",
        numQuestions: 4,
        grade: 0,
        disabled: false,
        isLoading: true,
        onClick: expect.any(Function),
      },
    ]);

    items[0]?.onClick();
    expect(onSectionClick).toHaveBeenCalledWith("intro");
  });

  it("disables quiz sections when complete or read only and falls back hrefs to hash", () => {
    const items = buildOverviewSectionItems({
      lessonReviewSections: ["starter-quiz", "exit-quiz"],
      sectionResults: {
        "starter-quiz": { isComplete: true, grade: 3, numQuestions: 3 },
      },
      isReadOnly: true,
      isHydratingInitialProgress: false,
      starterQuizNumQuestions: 3,
      exitQuizNumQuestions: 2,
      getSectionHref: () => undefined,
    });

    expect(items).toEqual([
      expect.objectContaining({
        section: "starter-quiz",
        href: "#",
        disabled: true,
      }),
      expect.objectContaining({
        section: "exit-quiz",
        href: "#",
        disabled: true,
      }),
    ]);
  });

  it("uses a no-op section click handler by default", () => {
    const items = buildOverviewSectionItems({
      lessonReviewSections: ["intro"],
      sectionResults: {},
      isReadOnly: false,
      isHydratingInitialProgress: false,
      starterQuizNumQuestions: 0,
      exitQuizNumQuestions: 0,
      getSectionHref: () => "/lesson/intro",
    });

    expect(() => items[0]?.onClick()).not.toThrow();
  });
});
