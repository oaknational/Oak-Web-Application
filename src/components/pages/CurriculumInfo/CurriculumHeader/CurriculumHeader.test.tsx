import CurriculumHeader from "./CurriculumHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumHeaderFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumHeader.fixture";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { parseSubjectPhaseSlug } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

describe("Component - Curriculum Header", () => {
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-secondary-aqa"),
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
    let keyStages: string;
    if (curriculumHeaderFixture().phase === "primary") {
      keyStages = "KS1 & KS2";
    } else if (curriculumHeaderFixture().phase === "secondary") {
      keyStages = "KS3 & KS4";
    } else {
      keyStages = "";
    }

    expect(await findByRole("heading", { level: 1 })).toHaveTextContent(
      `${keyStages} ${curriculumHeaderFixture().subject}`,
    );
  });

  test("should return correct page title for primary phase", () => {
    const { getByTestId } = renderComponent({
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-primary"),
    });

    expect(getByTestId("curriculum-heading")).toHaveTextContent(
      "KS1 & KS2 English",
    );
  });

  test("should return correct page title for secondary phase", () => {
    const { getByTestId } = renderComponent({
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-secondary"),
    });

    expect(getByTestId("curriculum-heading")).toHaveTextContent(
      "KS3 & KS4 English",
    );
  });

  test("user can see the tabular navigation", async () => {
    const { findByTestId } = renderComponent();
    const tabularNav = await findByTestId("tabularNav");
    expect(tabularNav).toBeInTheDocument();
  });

  test("keyStage metadata", () => {
    const { getByTestId } = renderComponent();
    const examboardMetadata = getByTestId("examboard-metadata");
    expect(examboardMetadata).toHaveTextContent("AQA (KS4)");
  });
});
