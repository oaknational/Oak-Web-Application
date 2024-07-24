import CurriculumDownloadTab from ".";

import { parseSubjectPhaseSlug } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockPrerelease } from "@/utils/mocks";

const render = renderWithProviders();

const tiersMock = [
  { tier: "Foundation", tier_slug: "foundation" },
  { tier: "Higher", tier_slug: "higher" },
];

const childSubjectsMock = [
  {
    subject: "Combined science",
    subject_slug: "combined-science",
  },
  {
    subject: "Biology",
    subject_slug: "biology",
  },
  {
    subject: "Chemistry",
    subject_slug: "chemistry",
  },
  {
    subject: "Physics",
    subject_slug: "physics",
  },
];

describe("Component - Curriculum Download Tab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      slugs: parseSubjectPhaseSlug("english-secondary-aqa"),
      mvRefreshTime: 1721314874829,
      tiers: [],
      childSubjects: [],
      ...overrides,
    };

    return render(<CurriculumDownloadTab {...defaultProps} />);
  };

  test("user can see download form", async () => {
    // NOTE: This is only active during testing.
    mockPrerelease("curriculum.downloads");
    const { findByText, findAllByTestId } = renderComponent();
    const formHeading = await findByText("Your details");
    const formInputs = await findAllByTestId("input");
    expect(formHeading).toBeInTheDocument();
    expect(formInputs).toHaveLength(1);
  });

  describe("Curriculum Downloads Tab: Secondary Maths", () => {
    test("user can see the tier selector for secondary maths", async () => {
      // NOTE: This is only active during testing.
      mockPrerelease("curriculum.downloads");
      const { findByText, findByTestId } = renderComponent({
        tiers: tiersMock,
      });
      const formHeading = await findByText("Download");
      const tierSelector = await findByTestId("tier-selector");
      expect(formHeading).toBeInTheDocument();
      expect(tierSelector).toBeInTheDocument();
    });

    test("user can see correct tiers in the selector for secondary maths", async () => {
      // NOTE: This is only active during testing.
      mockPrerelease("curriculum.downloads");
      const { findAllByTestId } = renderComponent({ tiers: tiersMock });
      const tierRadios = await findAllByTestId("tier-radio-button");
      expect(tierRadios).toHaveLength(2);
      expect(tierRadios[0]).toHaveTextContent("Foundation");
      expect(tierRadios[1]).toHaveTextContent("Higher");
    });
  });

  describe("Curriculum Downloads Tab: Secondary Science", () => {
    test("user can see the child subject selector for secondary science", async () => {
      // NOTE: This is only active during testing.
      mockPrerelease("curriculum.downloads");
      const { findByTestId } = renderComponent({
        tiers: tiersMock,
        child_subjects: childSubjectsMock,
        slugs: parseSubjectPhaseSlug("science-secondary-aqa"),
      });
      const childSubjectSelector = await findByTestId("child-subject-selector");
      expect(childSubjectSelector).toBeInTheDocument();
    });

    test("user can see the tiers and child subject selector for secondary science", async () => {
      // NOTE: This is only active during testing.
      mockPrerelease("curriculum.downloads");
      const { findByTestId } = renderComponent({
        tiers: tiersMock,
        child_subjects: childSubjectsMock,
        slugs: parseSubjectPhaseSlug("science-secondary-aqa"),
      });
      const childSubjectSelector = await findByTestId("child-subject-selector");
      const tierSelector = await findByTestId("tier-selector");
      expect(childSubjectSelector).toBeInTheDocument();
      expect(tierSelector).toBeInTheDocument();
    });

    test("user can see the correct child subjects in the correct order", async () => {
      // NOTE: This is only active during testing.
      mockPrerelease("curriculum.downloads");
      const { findAllByTestId } = renderComponent({
        tiers: tiersMock,
        child_subjects: childSubjectsMock,
        slugs: parseSubjectPhaseSlug("science-secondary-aqa"),
      });

      const childSubjectRadios = await findAllByTestId(
        "child-subject-radio-button",
      );
      expect(childSubjectRadios).toHaveLength(4);
      expect(childSubjectRadios[0]).toHaveTextContent("Combined science");
      expect(childSubjectRadios[1]).toHaveTextContent("Biology");
      expect(childSubjectRadios[2]).toHaveTextContent("Chemistry");
      expect(childSubjectRadios[3]).toHaveTextContent("Physics");
    });
  });
});
