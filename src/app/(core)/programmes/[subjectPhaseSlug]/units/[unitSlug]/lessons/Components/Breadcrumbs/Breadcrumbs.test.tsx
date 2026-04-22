import { screen } from "@testing-library/dom";

import { Breadcrumbs } from "./Breadcrumbs";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { resolveOakHref } from "@/common-lib/urls";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

const render = renderWithTheme;

const mockLessonData = teachersLessonOverviewFixture({
  examBoardSlug: "aqa",
  examBoardTitle: "AQA",
  tierSlug: "foundation",
  tierTitle: "Foundation",
});
const mockSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
  subjectSlug: mockLessonData.subjectSlug,
  phaseSlug: mockLessonData.phaseSlug,
  examboardSlug: mockLessonData.examBoardSlug,
  subjectParentTitle: mockLessonData.subjectParent,
});

describe("Breadcrumbs", () => {
  it("renders optional pfs for programme page breadcrumb", () => {
    render(
      <Breadcrumbs
        data={mockLessonData}
        subjectPhaseSlug={mockSubjectPhaseSlug}
      />,
    );
    const firstBreadcrumbText = `${mockLessonData.subjectTitle}, ${mockLessonData.phaseTitle}, ${mockLessonData.keyStageTitle}, ${mockLessonData.yearTitle}, ${mockLessonData.tierTitle}, ${mockLessonData.examBoardTitle}`;

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
    render(
      <Breadcrumbs
        data={mockLessonData}
        subjectPhaseSlug={mockSubjectPhaseSlug}
      />,
    );

    const unitOverviewLink = screen.getByRole("link", {
      name: mockLessonData.unitTitle,
    });
    expect(unitOverviewLink).toBeInTheDocument();
    expect(unitOverviewLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-unit-overview",
        unitSlug: mockLessonData.unitSlug,
        programmeSlug: mockLessonData.programmeSlug,
      }),
    );
  });
  it("renders a final breadcrumb containing the lesson title for lesson data", () => {
    render(
      <Breadcrumbs
        data={mockLessonData}
        subjectPhaseSlug={mockSubjectPhaseSlug}
      />,
    );

    const lessonBreadcrumb = screen.getByText(mockLessonData.lessonTitle);
    expect(lessonBreadcrumb).toBeInTheDocument();
  });
  it("renders 3 breadcrumbs for lesson data", () => {
    render(
      <Breadcrumbs
        data={mockLessonData}
        subjectPhaseSlug={mockSubjectPhaseSlug}
      />,
    );

    const breadcrumbs = screen.getAllByRole("listitem");
    expect(breadcrumbs).toHaveLength(3);
  });
  it("renders a final breadcrumb containing the unit count for unit data", () => {
    const mockUnitData = teachersUnitOverviewFixture();
    render(
      <Breadcrumbs
        data={mockUnitData}
        subjectPhaseSlug={getTeacherSubjectPhaseSlug({
          subjectSlug: mockUnitData.subjectSlug,
          phaseSlug: mockUnitData.phaseSlug,
          examboardSlug: mockUnitData.examBoardSlug,
          subjectParentTitle: mockUnitData.parentSubject,
        })}
      />,
    );

    const unitBreadcrumb = screen.getByText("Unit 1 of 10");
    expect(unitBreadcrumb).toBeInTheDocument();
  });
  it("renders 2 breadcrumbs for unit data", () => {
    const mockUnitData = teachersUnitOverviewFixture();
    render(
      <Breadcrumbs
        data={mockUnitData}
        subjectPhaseSlug={getTeacherSubjectPhaseSlug({
          subjectSlug: mockUnitData.subjectSlug,
          phaseSlug: mockUnitData.phaseSlug,
          examboardSlug: mockUnitData.examBoardSlug,
          subjectParentTitle: mockUnitData.parentSubject,
        })}
      />,
    );

    const breadcrumbs = screen.getAllByRole("listitem");
    expect(breadcrumbs).toHaveLength(2);
  });
});
