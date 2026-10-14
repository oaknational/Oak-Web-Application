import { screen } from "@testing-library/dom";

import { Breadcrumbs } from "./Breadcrumbs";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { resolveOakHref } from "@/common-lib/urls";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import {
  getProgrammeStateForLesson,
  getProgrammeStateForUnit,
} from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

const mockLessonData = teachersLessonOverviewFixture({
  examBoardSlug: "aqa",
  examBoardTitle: "AQA",
  tierSlug: "foundation",
  tierTitle: "Foundation",
});

const renderWithLessonState = renderWithProviders({
  ...allProviders,
  teacherBrowseAnalytics: {
    programmeState: getProgrammeStateForLesson(mockLessonData),
  },
});

const mockUnitData = teachersUnitOverviewFixture();
const renderWithUnitState = renderWithProviders({
  ...allProviders,
  teacherBrowseAnalytics: {
    programmeState: getProgrammeStateForUnit(mockUnitData),
  },
});

const mockSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
  subjectSlug: mockLessonData.subjectSlug,
  phaseSlug: mockLessonData.phaseSlug,
  examboardSlug: mockLessonData.examBoardSlug,
  subjectParentTitle: mockLessonData.subjectParent,
});

describe("Breadcrumbs", () => {
  it("renders optional pfs for programme page breadcrumb", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug={mockSubjectPhaseSlug} mode="lesson" />,
    );
    const firstBreadcrumbText = `${mockLessonData.subjectTitle}, ${mockLessonData.phaseTitle}, ${mockLessonData.keyStageTitle}, ${mockLessonData.yearGroupTitle}, ${mockLessonData.tierTitle}, ${mockLessonData.examBoardTitle}`;

    const firstBreadcrumbLink = screen.getByRole("link", {
      name: firstBreadcrumbText,
    });
    expect(firstBreadcrumbLink).toBeInTheDocument();
    expect(firstBreadcrumbLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: mockSubjectPhaseSlug,
        tab: "units",
      }),
    );
  });
  it("renders a unit page link for lesson data", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug={mockSubjectPhaseSlug} mode="lesson" />,
    );

    const unitOverviewLink = screen.getByRole("link", {
      name: mockLessonData.unitTitle,
    });
    expect(unitOverviewLink).toBeInTheDocument();
    expect(unitOverviewLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
      }),
    );
  });
  it("renders a final breadcrumb containing the lesson title for lesson data", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug={mockSubjectPhaseSlug} mode="lesson" />,
    );

    const lessonBreadcrumb = screen.getByText(mockLessonData.lessonTitle);
    expect(lessonBreadcrumb).toBeInTheDocument();
  });
  it("renders 3 breadcrumbs for lesson data", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug={mockSubjectPhaseSlug} mode="lesson" />,
    );

    const breadcrumbs = screen.getAllByRole("listitem");
    expect(breadcrumbs).toHaveLength(3);
  });
  it("renders a final breadcrumb containing the unit count for unit data", () => {
    renderWithUnitState(
      <Breadcrumbs
        data={mockUnitData}
        subjectPhaseSlug={getTeacherSubjectPhaseSlug({
          subjectSlug: mockUnitData.subjectSlug,
          phaseSlug: mockUnitData.phaseSlug,
          examboardSlug: mockUnitData.examBoardSlug,
          subjectParentTitle: mockUnitData.parentSubject,
        })}
        mode="unit"
      />,
    );

    const unitBreadcrumb = screen.getByText("Unit 1 of 10");
    expect(unitBreadcrumb).toBeInTheDocument();
  });
  it("renders 2 breadcrumbs for unit data", () => {
    renderWithUnitState(
      <Breadcrumbs
        data={mockUnitData}
        subjectPhaseSlug={getTeacherSubjectPhaseSlug({
          subjectSlug: mockUnitData.subjectSlug,
          phaseSlug: mockUnitData.phaseSlug,
          examboardSlug: mockUnitData.examBoardSlug,
          subjectParentTitle: mockUnitData.parentSubject,
        })}
        mode="unit"
      />,
    );

    const breadcrumbs = screen.getAllByRole("listitem");
    expect(breadcrumbs).toHaveLength(2);
  });
  it("renders downloads breadcrumb trail with lesson link and downloads as current page", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug="biology-secondary-aqa" mode="downloads" />,
    );

    const programmeBreadcrumbText =
      "Biology, Secondary, Key Stage 3, Year 7, Foundation, AQA";
    const programmeLink = screen.getByRole("link", {
      name: programmeBreadcrumbText,
    });
    expect(programmeLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "biology-secondary-aqa",
        tab: "units",
      }),
    );

    const unitLink = screen.getByRole("link", {
      name: mockLessonData.unitTitle,
    });
    expect(unitLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
      }),
    );

    const lessonLink = screen.getByRole("link", {
      name: mockLessonData.lessonTitle,
    });
    expect(lessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
        lessonSlug: mockLessonData.lessonSlug,
      }),
    );

    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Downloads" })).toBeNull();
  });
  it("renders media breadcrumb trail with lesson link and media as current page", () => {
    renderWithLessonState(
      <Breadcrumbs subjectPhaseSlug="biology-secondary-aqa" mode="media" />,
    );

    const programmeBreadcrumbText =
      "Biology, Secondary, Key Stage 3, Year 7, Foundation, AQA";
    const programmeLink = screen.getByRole("link", {
      name: programmeBreadcrumbText,
    });
    expect(programmeLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "biology-secondary-aqa",
        tab: "units",
      }),
    );

    const unitLink = screen.getByRole("link", {
      name: mockLessonData.unitTitle,
    });
    expect(unitLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
      }),
    );

    const lessonLink = screen.getByRole("link", {
      name: mockLessonData.lessonTitle,
    });
    expect(lessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
        lessonSlug: mockLessonData.lessonSlug,
      }),
    );

    expect(screen.getByText("Media")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Media" })).toBeNull();
  });
});
