import { screen } from "@testing-library/dom";

import { UnitView } from "./UnitView";
import type { UnitViewProps } from "./UnitView";
import { LessonList } from "./LessonList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./LessonList");

const render = renderWithProviders();

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
describe("UnitView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LessonList and passes lesson props with computed lessonCount", () => {
    render(
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
        unitIndex={2}
        unitCount={12}
        threads={[]}
        phaseSlug="secondary"
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
        unitIndex: 2,
        unitCount: 12,
        lessonCount: 2,
      }),
      {},
    );
  });
  it("renders why this why now", () => {
    render(
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
        unitIndex={2}
        unitCount={12}
        threads={[]}
        phaseSlug="secondary"
        whyThisWhyNow={"mock why this why now"}
      />,
    );

    expect(screen.getAllByText("mock why this why now")[0]).toBeInTheDocument();
  });
  it("renders prior knowledge requirements in a list", () => {
    render(
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
        unitIndex={2}
        unitCount={12}
        threads={[]}
        phaseSlug="secondary"
        priorKnowledgeRequirements={["Requirement 1", "Requirement 2"]}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent("Requirement 1");
    expect(listItems[1]).toHaveTextContent("Requirement 2");
  });
  it("renders threads", () => {
    render(
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
        unitIndex={2}
        unitCount={12}
        threads={["Thread 1", "Thread 2"]}
        phaseSlug="secondary"
      />,
    );

    const thread1 = screen.getAllByText("Thread 1");
    expect(thread1[0]).toBeInTheDocument();

    const thread2 = screen.getAllByText("Thread 2");
    expect(thread2[0]).toBeInTheDocument();
  });
});
