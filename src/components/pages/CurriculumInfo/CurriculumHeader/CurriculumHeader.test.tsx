import CurriculumHeader from "./CurriculumHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumHeaderFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumHeader.fixture";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { parseSubjectPhaseSlug } from "@/pages/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";

describe("Component - Curriculum Header", () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      curriculumSelectionSlugs: parseSubjectPhaseSlug("maths-secondary"),
      subjectPhaseOptions: { subjects: subjectPhaseOptionsFixture() },
      pageSlug: "test-slug",
      tab: "overview",
      ...overrides,
    };

    return renderWithTheme(<CurriculumHeader {...defaultProps} />);
  };

  test("user can see the breadcrumbs", async () => {
    const { findAllByRole } = renderComponent();
    const links = await findAllByRole("link");
    expect(links[0]).toHaveTextContent("Home");
    expect(links[1]).toHaveTextContent("Curriculum resources");
    expect(links[2]).toHaveTextContent("Overview");
  });

  test("user can see the subject icon", async () => {
    const { findByTestId } = renderComponent();
    const subjectIcon = await findByTestId("subjectIcon");
    expect(subjectIcon).toBeInTheDocument();
  });

  test("user can see the page title", async () => {
    const { findByRole } = renderComponent();
    const pageTitle = `${curriculumHeaderFixture().phase.title} ${
      curriculumHeaderFixture().subject.title
    }`;
    expect(await findByRole("heading", { level: 1 })).toHaveTextContent(
      pageTitle,
    );
  });

  test("user can see the tabular navigation", async () => {
    const { findByTestId } = renderComponent();
    const tabularNav = await findByTestId("tabularNav");
    expect(tabularNav).toBeInTheDocument();
  });
});
