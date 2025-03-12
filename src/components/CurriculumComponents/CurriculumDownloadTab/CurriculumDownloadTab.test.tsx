import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CurriculumDownloadTab, {
  createCurriculumDownloadsQuery,
  trackCurriculumDownload,
} from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockPrerelease } from "@/utils/mocks";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

const render = renderWithProviders();
const mvRefreshTime = 1721314874829;

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

const curriculumResourcesDownloadRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumResourcesDownloadRefined: (...args: unknown[]) =>
        curriculumResourcesDownloadRefined(...args),
    },
  }),
}));

describe("Component Curriculum Download Tab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrides = {}) => {
    const defaultProps = {
      slugs: parseSubjectPhaseSlug("english-secondary-aqa")!,
      mvRefreshTime,
      tiers: [],
      childSubjects: [],
      curriculumInfo: {
        curriculaDesc: "",
        subjectTitle: "English",
        phaseTitle: "Secondary",
        examboardTitle: null,
      },
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
      const { findByTestId } = renderComponent({
        tiers: tiersMock,
      });
      const formHeading = screen.getByRole("heading", {
        name: "Download",
        level: 2,
      });
      expect(formHeading).toBeInTheDocument();
      const tierSelector = await findByTestId("tier-selector");
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
  describe("analytics: curriculumResourcesDownloadRefined", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("sends a tracking event when curriculum downloads are refined", async () => {
      mockPrerelease("curriculum.downloads");
      const { findByTestId, findByText } = renderComponent({
        tiers: tiersMock,
        child_subjects: childSubjectsMock,
        slugs: parseSubjectPhaseSlug("science-secondary-aqa"),
      });

      const childSubjectSelector = await findByTestId("child-subject-selector");
      const tierSelector = await findByTestId("tier-selector");

      await act(async () => {
        await userEvent.click(childSubjectSelector);
        await userEvent.click(tierSelector);
      });

      const nextButton = await findByText("Next");
      await act(async () => {
        await userEvent.click(nextButton);
      });

      expect(curriculumResourcesDownloadRefined).toHaveBeenCalledTimes(1);
      expect(curriculumResourcesDownloadRefined).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        childSubjectName: "Combined",
        childSubjectSlug: "combined-science",
        componentType: "download_tab",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        learningTier: "Foundation",
        platform: "owa",
        product: "curriculum resources",
        subjectSlug: "science",
        subjectTitle: "English",
      });
    });
  });
});

describe("Downloads tab: unit tests", () => {
  const mvRefreshTime = 1721314874829;
  test("Query is created properly: Science secondary AQA", async () => {
    const data = {
      mvRefreshTime: 1721314874829,
      subjectSlug: "science",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
      tierSlug: "foundation",
      childSubjectSlug: "combined-science",
    };
    const {
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    } = data;
    const query = createCurriculumDownloadsQuery(
      "published",
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    );
    expect(query.toString()).toEqual(
      `mvRefreshTime=1721314874829&subjectSlug=science&phaseSlug=secondary&state=published&ks4OptionSlug=aqa&tierSlug=foundation&childSubjectSlug=combined-science`,
    );
  });

  test("Query is created properly: English primary", async () => {
    const query = createCurriculumDownloadsQuery(
      "published",
      mvRefreshTime,
      "english",
      "primary",
      null,
      null,
      null,
    );
    expect(query.toString()).toEqual(
      `mvRefreshTime=1721314874829&subjectSlug=english&phaseSlug=primary&state=published`,
    );
  });
});

describe("trackCurriculumDownload", () => {
  const mockTrack = {
    curriculumResourcesDownloaded: jest.fn(),
  } as unknown as TrackFns;
  const mockOnHubspotSubmit = jest.fn().mockResolvedValue("mockResponse");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls onHubspotSubmit and track.curriculumResourcesDownloadedCurriculumDocument with correct parameters", async () => {
    const data = {
      schoolId: "123456-Test school",
      schoolName: "Test School",
      email: "test@example.com",
      termsAndConditions: true,
      schoolNotListed: false,
      schools: [
        {
          urn: "123456",
          name: "Test School",
          la: "test-la",
          postcode: "T1 WTF",
          fullInfo: "Test School, test-la, T1 WTF",
          status: "Open",
        },
      ],
      downloadType: "word" as const,
    };

    const subjectTitle = "Mathematics";
    const analyticsUseCase = "Teacher";
    const slugs = {
      phaseSlug: "primary",
      subjectSlug: "maths",
      ks4OptionSlug: "",
    };
    await trackCurriculumDownload(
      data,
      subjectTitle,
      mockOnHubspotSubmit,
      mockTrack,
      analyticsUseCase,
      slugs,
    );

    expect(mockOnHubspotSubmit).toHaveBeenCalledWith({
      school: "123456-Test school",
      schoolName: "Test School",
      email: "test@example.com",
      terms: true,
      resources: ["docx"],
      onSubmit: expect.any(Function),
    });

    expect(mockTrack.curriculumResourcesDownloaded).toHaveBeenCalledWith({
      subjectTitle: "Mathematics",
      analyticsUseCase: "Teacher",
      keyStageSlug: null,
      keyStageTitle: null,
      emailSupplied: true,
      schoolOption: "Selected school",
      schoolUrn: "123456",
      schoolName: "Test School",
      engagementIntent: "explore",
      eventVersion: "2.0.0",
      phase: "primary",
      platform: "owa",
      product: "curriculum resources",
      resourceType: ["curriculum document"],
      componentType: "download_button",
    });
  });
});
