import { buildOverviewSectionItems } from "./buildOverviewSectionItems";

import type { LessonReviewSection } from "@/components/PupilComponents/lessonSections";

const allSections: LessonReviewSection[] = [
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
];

describe("buildOverviewSectionItems", () => {
  it("builds section items with progress, hrefs and quiz metadata", () => {
    const onSectionClick = jest.fn();
    const getSectionHref = jest.fn(
      (section: LessonReviewSection) => `/lesson/${section}`,
    );

    const items = buildOverviewSectionItems({
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
      sectionsWithData: allSections,
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
      sectionsWithData: allSections,
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
        section: "intro",
        href: "#",
        disabled: true,
      }),
      expect.objectContaining({
        section: "starter-quiz",
        href: "#",
        disabled: true,
      }),
      expect.objectContaining({
        section: "video",
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
      sectionsWithData: ["intro"],
      sectionResults: {},
      isReadOnly: false,
      isHydratingInitialProgress: false,
      starterQuizNumQuestions: 0,
      exitQuizNumQuestions: 0,
      getSectionHref: () => "/lesson/intro",
    });

    expect(() => items[0]?.onClick()).not.toThrow();
  });

  it("hides sections the lesson has no content for (e.g. no exit quiz)", () => {
    const items = buildOverviewSectionItems({
      lessonReviewSections: ["intro", "starter-quiz", "video"],
      sectionsWithData: ["intro", "starter-quiz", "video"],
      sectionResults: {},
      isReadOnly: false,
      isHydratingInitialProgress: false,
      starterQuizNumQuestions: 3,
      exitQuizNumQuestions: 0,
      getSectionHref: (section) => `/lesson/${section}`,
    });

    expect(items.map((item) => item.section)).toEqual([
      "intro",
      "starter-quiz",
      "video",
    ]);
    expect(items.some((item) => item.section === "exit-quiz")).toBe(false);
  });

  it("hides data-less sections but shows variant-excluded sections (with data) as disabled", () => {
    const onSectionClick = jest.fn();
    const getSectionHref = jest.fn(
      (section: LessonReviewSection) => `/lesson/${section}`,
    );

    const items = buildOverviewSectionItems({
      // Variant restricts the pupil to intro + video...
      lessonReviewSections: ["intro", "video"],
      // ...but the lesson has a starter quiz (data) and no exit quiz (no data).
      sectionsWithData: ["intro", "starter-quiz", "video"],
      sectionResults: {},
      isReadOnly: false,
      isHydratingInitialProgress: false,
      starterQuizNumQuestions: 3,
      exitQuizNumQuestions: 0,
      onSectionClick,
      getSectionHref,
    });

    // exit-quiz (no data) is omitted entirely; the rest remain.
    expect(items.map((item) => item.section)).toEqual([
      "intro",
      "starter-quiz",
      "video",
    ]);

    // starter-quiz has data but is excluded by the variant → shown disabled.
    const starterQuiz = items.find((item) => item.section === "starter-quiz");
    expect(starterQuiz?.disabled).toBe(true);
    expect(starterQuiz?.href).toBe("#");

    // intro/video are available → enabled (no disabled flag) and clickable.
    expect(items[0]).not.toHaveProperty("disabled");
    expect(items[2]).not.toHaveProperty("disabled");

    items[1]?.onClick();
    items[2]?.onClick();
    expect(onSectionClick).toHaveBeenCalledTimes(1);
    expect(onSectionClick).toHaveBeenCalledWith("video");
  });
});
