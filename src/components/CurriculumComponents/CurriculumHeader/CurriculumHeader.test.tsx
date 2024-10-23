import { findAllByRole } from "@testing-library/dom";

import CurriculumHeader from "./CurriculumHeader";

import curriculumHeaderFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumHeader.fixture";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockPrerelease } from "@/utils/mocks";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

const render = renderWithProviders();

describe("Component - Curriculum Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-secondary-aqa")!,
      keyStages: ["ks3", "ks4"],
      subjectPhaseOptions: { subjects: subjectPhaseOptionsFixture() },
      pageSlug: "test-slug",
      tab: "overview",
      ...overrides,
    };

    return render(<CurriculumHeader {...defaultProps} />);
  };

  test("user can see the breadcrumbs", async () => {
    const { findAllByRole } = renderComponent();
    const links = await findAllByRole("link");
    expect(links[0]).toHaveTextContent("Home");
    expect(links[1]).toHaveTextContent("Curriculum resources");
    expect(links[2]).toHaveTextContent("Unit sequence");
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

  test("should return correct page title for primary phase subject", () => {
    const { getByTestId } = renderComponent({
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-primary"),
      keyStages: ["ks1", "ks2"],
    });

    expect(getByTestId("curriculum-heading")).toHaveTextContent(
      "KS1 & KS2 English",
    );
  });

  test("should return correct page title for secondary phase subject", () => {
    const { getByTestId } = renderComponent({
      curriculumSelectionSlugs: parseSubjectPhaseSlug("english-secondary"),
    });

    expect(getByTestId("curriculum-heading")).toHaveTextContent(
      "KS3 & KS4 English",
    );
  });

  test("user can see the tabular navigation", async () => {
    // NOTE: This is only active during testing.
    mockPrerelease("curriculum.downloads");
    const { findByTestId } = renderComponent();
    const tabularNav = await findByTestId("tabularNav");
    expect(tabularNav).toBeInTheDocument();
    const links = await findAllByRole(tabularNav, "link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent("Unit sequence");
    expect(links[1]).toHaveTextContent("Overview");
    expect(links[2]).toHaveTextContent("Download");
  });

  test("keyStage metadata", () => {
    const { getByTestId } = renderComponent();
    const examboardMetadata = getByTestId("examboard-metadata");
    expect(examboardMetadata).toHaveTextContent("AQA (KS4)");
  });
});
