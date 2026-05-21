import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { UnitOverviewContent } from "./UnitOverviewContent";
import type { UnitOverviewContentProps } from "./UnitOverviewContent";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";

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

const defaultProps: UnitOverviewContentProps = {
  programmeSlug: "biology-secondary-ks4-foundation-aqa",
  unitSlug: "cells",
  unitTitle: "Cells",
  unitDescription: "Learn about cells",
  subjectTitle: "Biology",
  subjectSlug: "biology",
  keyStageSlug: "ks4",
  keyStageTitle: "Key Stage 4",
  lessons: lessons as UnitOverviewContentProps["lessons"],
  unitIndex: 2,
  unitCount: 12,
  tierOptionToggles: [
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
  subjectOptionToggles: [
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
  threads: [],
  phaseSlug: "secondary",
  nextUnit: null,
  prevUnit: null,
  subjectCategories: null,
  showDownloadMessage: false,
  setShowDownloadMessage: jest.fn(),
  examBoardTitle: "AQA",
  phaseTitle: "Secondary",
  subjectPhaseSlug: "biology-secondary-ks4",
  yearGroupTitle: "Year 10",
  nonCurriculum: false,
  priorKnowledgeRequirements: [],
  whyThisWhyNow: "",
};
describe("UnitOverviewContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LessonList and passes lesson props with computed lessonCount", () => {
    render(<UnitOverviewContent {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Unit 2 of 12: Cells" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lesson 1")).toBeInTheDocument();
    expect(screen.getByText("Lesson 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save this unit: cells/i }),
    ).toBeInTheDocument();
  });

  it("renders programme toggles with selected states and links", () => {
    render(<UnitOverviewContent {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Learning tier (KS4)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Exam subject (KS4)" }),
    ).toBeInTheDocument();
    const foundationLink = screen.getByRole("link", { name: "Foundation" });
    expect(foundationLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
    expect(foundationLink).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "biology-secondary-ks4-higher-aqa",
        unitSlug: "cells",
      }),
    );
    const biologyLink = screen.getByRole("link", { name: "Biology" });
    expect(biologyLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
    expect(biologyLink).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Combined science" }),
    ).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
  });
  it("renders why this why now", () => {
    render(
      <UnitOverviewContent
        {...defaultProps}
        whyThisWhyNow="mock why this why now"
      />,
    );

    expect(screen.getAllByText("mock why this why now")[0]).toBeInTheDocument();
  });
  it("renders prior knowledge requirements in a list", () => {
    render(
      <UnitOverviewContent
        {...defaultProps}
        priorKnowledgeRequirements={["Requirement 1", "Requirement 2"]}
      />,
    );

    const priorKnowledgeHeading = screen.getByRole("heading", {
      name: "Prior knowledge requirements",
    });
    const priorKnowledgeSection = priorKnowledgeHeading.closest("div");

    expect(priorKnowledgeSection).not.toBeNull();
    expect(priorKnowledgeSection).toHaveTextContent("Requirement 1");
    expect(priorKnowledgeSection).toHaveTextContent("Requirement 2");
  });
  it("renders threads", () => {
    render(
      <UnitOverviewContent
        {...defaultProps}
        threads={["Thread 1", "Thread 2"]}
      />,
    );

    const thread1 = screen.getAllByText("Thread 1");
    expect(thread1[0]).toBeInTheDocument();

    const thread2 = screen.getAllByText("Thread 2");
    expect(thread2[0]).toBeInTheDocument();
  });
  it("renders previous unit link", () => {
    render(
      <UnitOverviewContent
        {...defaultProps}
        prevUnit={{ slug: "unit-1", title: "Unit 1" }}
      />,
    );
    const previousUnitLink = screen.getByRole("link", {
      name: /previous unit/i,
    });
    expect(previousUnitLink).toBeInTheDocument();
    expect(previousUnitLink).toHaveProperty(
      "href",
      `http://localhost${resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "unit-1",
      })}`,
    );
  });
  it("renders next unit link", () => {
    render(
      <UnitOverviewContent
        {...defaultProps}
        nextUnit={{ slug: "unit-3", title: "Unit 3" }}
      />,
    );

    const nextUnitLink = screen.getByRole("link", {
      name: /next unit/i,
    });
    expect(nextUnitLink).toBeInTheDocument();
    expect(nextUnitLink).toHaveProperty(
      "href",
      `http://localhost${resolveOakHref({
        page: "integrated-unit-overview",
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "unit-3",
      })}`,
    );
  });
  it("renders a banner when unit download message is true", async () => {
    const mockClose = jest.fn();
    render(
      <UnitOverviewContent
        {...defaultProps}
        showDownloadMessage={true}
        setShowDownloadMessage={mockClose}
      />,
    );

    const banner = screen.getByText(
      "Downloads can take a few minutes, especially for larger files or slower connections.",
    );
    expect(banner).toBeInTheDocument();

    const bannerCloseBtn = screen.getByTestId("inline-banner-close-button");
    const user = userEvent.setup();
    await user.click(bannerCloseBtn);

    expect(mockClose).toHaveBeenCalledWith(false);
  });
});
