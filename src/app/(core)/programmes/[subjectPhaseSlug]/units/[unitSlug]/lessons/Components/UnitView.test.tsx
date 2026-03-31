import { UnitView } from "./UnitView";
import type { UnitViewProps } from "./UnitView";
import { LessonList } from "./LessonList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./LessonList");

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
        programmeSlug="biology-secondary-ks3"
        unitSlug="cells"
        unitTitle="Cells"
        unitDescription="Learn about cells"
        subjectTitle="Biology"
        subjectSlug="biology"
        keyStageSlug="ks3"
        keyStageTitle="Key Stage 3"
        lessons={lessons as UnitViewProps["lessons"]}
        unitOrder={2}
        unitCount={12}
      />,
    );

    expect(LessonList).toHaveBeenCalledWith(
      expect.objectContaining({
        programmeSlug: "biology-secondary-ks3",
        unitSlug: "cells",
        unitTitle: "Cells",
        unitDescription: "Learn about cells",
        subjectTitle: "Biology",
        subjectSlug: "biology",
        keyStageSlug: "ks3",
        keyStageTitle: "Key Stage 3",
        lessons,
        unitOrder: 2,
        unitCount: 12,
        lessonCount: 2,
      }),
      {},
    );
  });
});
