import { UnitView } from "./UnitView";
import type { UnitViewProps } from "./UnitView";
import { LessonList } from "./LessonList";
import { ProgrammeToggles } from "./ProgrammeToggles";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./LessonList");
jest.mock("./ProgrammeToggles");

describe("UnitView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LessonList and passes lesson props with computed lessonCount", () => {
    const lessons = [
      {
        lessonSlug: "lesson-1",
        lessonTitle: "Lesson 1",
      },
      {
        lessonSlug: "lesson-2",
        lessonTitle: "Lesson 2",
      },
    ];

    renderWithProviders()(
      <UnitView
        programmeSlug="biology-secondary-ks4-foundation-aqa"
        unitSlug="cells"
        unitTitle="Cells"
        unitDescription="Learn about cells"
        subjectTitle="Biology"
        subjectSlug="biology"
        keyStageSlug="ks4"
        keyStageTitle="Key Stage 4"
        lessons={lessons as UnitViewProps["lessons"]}
        unitIndex={2}
        unitCount={12}
        tierOptionToggles={[
          {
            title: "Foundation",
            programmeSlug: "biology-secondary-ks4-foundation-aqa",
            isSelected: true,
          },
          {
            title: "Higher",
            programmeSlug: "biology-secondary-ks4-higher-aqa",
            isSelected: false,
          },
        ]}
        subjectOptionToggles={[
          {
            title: "Biology",
            programmeSlug: "biology-secondary-ks4-foundation-aqa",
            isSelected: true,
          },
          {
            title: "Combined science",
            programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
            isSelected: false,
          },
        ]}
      />,
    );

    expect(ProgrammeToggles).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        heading: "Learning tier (KS4)",
        headingId: "tier-toggle-heading",
        unitSlug: "cells",
        programmeToggles: [
          {
            title: "Foundation",
            programmeSlug: "biology-secondary-ks4-foundation-aqa",
            isSelected: true,
          },
          {
            title: "Higher",
            programmeSlug: "biology-secondary-ks4-higher-aqa",
            isSelected: false,
          },
        ],
      }),
      {},
    );

    expect(LessonList).toHaveBeenCalledWith(
      expect.objectContaining({
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
        unitTitle: "Cells",
        unitDescription: "Learn about cells",
        subjectTitle: "Biology",
        subjectSlug: "biology",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        lessons,
        unitIndex: 2,
        unitCount: 12,
        lessonCount: 2,
      }),
      {},
    );

    expect(ProgrammeToggles).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        heading: "Exam subject (KS4)",
        headingId: "subject-toggle-heading",
        unitSlug: "cells",
        programmeToggles: [
          {
            title: "Biology",
            programmeSlug: "biology-secondary-ks4-foundation-aqa",
            isSelected: true,
          },
          {
            title: "Combined science",
            programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
            isSelected: false,
          },
        ],
      }),
      {},
    );
  });
});
