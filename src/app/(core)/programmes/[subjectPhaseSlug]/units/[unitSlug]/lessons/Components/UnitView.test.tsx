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
] as UnitViewProps["lessons"];

const defaultProps: UnitViewProps = {
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
  tierOptionToggles: [],
  subjectOptionToggles: [],
  threads: [],
  phaseSlug: "secondary",
  nextUnit: null,
  prevUnit: null,
  subjectCategories: null,
  yearGroupTitle: "Year 10",
  examBoardSlug: "aqa",
  examBoardTitle: "AQA",
  subjectPhaseSlug: "biology-secondary",
};

describe("UnitView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LessonList and passes lesson props with computed lessonCount", () => {
    render(
      <UnitView
        {...defaultProps}
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
  it("renders why this why now", () => {
    render(
      <UnitView {...defaultProps} whyThisWhyNow="mock why this why now" />,
    );

    expect(screen.getAllByText("mock why this why now")[0]).toBeInTheDocument();
  });
  it("renders prior knowledge requirements in a list", () => {
    render(
      <UnitView
        {...defaultProps}
        priorKnowledgeRequirements={["Requirement 1", "Requirement 2"]}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent("Requirement 1");
    expect(listItems[1]).toHaveTextContent("Requirement 2");
  });
  it("renders threads", () => {
    render(<UnitView {...defaultProps} threads={["Thread 1", "Thread 2"]} />);

    const thread1 = screen.getAllByText("Thread 1");
    expect(thread1[0]).toBeInTheDocument();

    const thread2 = screen.getAllByText("Thread 2");
    expect(thread2[0]).toBeInTheDocument();
  });
  it("renders previous unit link", () => {
    render(
      <UnitView
        {...defaultProps}
        programmeSlug="biology-secondary-ks3"
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
        {...defaultProps}
        programmeSlug="biology-secondary-ks3"
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
