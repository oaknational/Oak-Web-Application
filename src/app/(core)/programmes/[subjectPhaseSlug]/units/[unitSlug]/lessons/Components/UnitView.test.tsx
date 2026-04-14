import { screen } from "@testing-library/dom";

import { UnitView } from "./UnitView";
import type { UnitViewProps } from "./UnitView";
import { LessonList } from "./LessonList";
import { ProgrammeToggles } from "./ProgrammeToggles";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./LessonList");
jest.mock("./ProgrammeToggles");

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
        threads={[]}
        phaseSlug="secondary"
        nextUnit={null}
        prevUnit={null}
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
        tierOptionToggles={[]}
        subjectOptionToggles={[]}
        nextUnit={null}
        prevUnit={null}
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
        tierOptionToggles={[]}
        subjectOptionToggles={[]}
        nextUnit={null}
        prevUnit={null}
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
        tierOptionToggles={[]}
        subjectOptionToggles={[]}
        nextUnit={null}
        prevUnit={null}
      />,
    );

    const thread1 = screen.getAllByText("Thread 1");
    expect(thread1[0]).toBeInTheDocument();

    const thread2 = screen.getAllByText("Thread 2");
    expect(thread2[0]).toBeInTheDocument();
  });
  it("renders previous unit link", () => {
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
        tierOptionToggles={[]}
        subjectOptionToggles={[]}
        nextUnit={null}
        prevUnit={{ slug: "unit-1", title: "Unit 1" }}
      />,
    );

    const previousUnitLink = screen.getByRole("link", {
      name: /previous unit/i,
    });
    expect(previousUnitLink).toBeInTheDocument();
    expect(previousUnitLink).toHaveProperty(
      "href",
      "http://localhost/programmes/biology-secondary-ks3/units/unit-1/lessons",
    );
  });
  it("renders next unit link", () => {
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
        tierOptionToggles={[]}
        subjectOptionToggles={[]}
        prevUnit={null}
        nextUnit={{ slug: "unit-3", title: "Unit 3" }}
      />,
    );

    const nextUnitLink = screen.getByRole("link", {
      name: /next unit/i,
    });
    expect(nextUnitLink).toBeInTheDocument();
    expect(nextUnitLink).toHaveProperty(
      "href",
      "http://localhost/programmes/biology-secondary-ks3/units/unit-3/lessons",
    );
  });
});
