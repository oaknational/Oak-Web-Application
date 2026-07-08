import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";

import {
  DownloadSuccessView,
  type DownloadSuccessViewProps,
} from "./DownloadSuccessView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import {
  setupMockLinkClick,
  teardownMockLinkClick,
  mockLinkClick,
} from "@/utils/mockLinkClick";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";
import type { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });

const onwardContentSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      onwardContentSelected,
    },
  }),
}));

const mockGetConsent = jest.fn();

jest.mock("@oaknational/oak-consent-client", () => {
  const actual = jest.requireActual("@oaknational/oak-consent-client");

  return {
    ...actual,
    useOakConsent: jest.fn(() => ({
      state: { policyConsents: [], requiresInteraction: false },
      logConsents: jest.fn().mockResolvedValue(undefined),
      getConsent: mockGetConsent,
    })),
  };
});

const lessons: LessonListSchema = [
  {
    lessonSlug: "transverse-waves",
    lessonTitle: "Transverse waves",
    description: "Transverse waves lesson description",
    pupilLessonOutcome: "Outcome",
    expired: false,
    orderInUnit: 1,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    geoRestricted: false,
    loginRequired: false,
  },
  {
    lessonSlug: "lesson-one",
    lessonTitle: "Measuring wave speed",
    description:
      "In this lesson, pupils measure wave speed and calculate values using the wave equation.",
    pupilLessonOutcome:
      "I can calculate wave speed from frequency and wavelength and explain what the result means.",
    expired: false,
    orderInUnit: 2,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: "2025-10-06T14:00:00.000Z",
    geoRestricted: false,
    loginRequired: false,
  },
];

const baseLesson: DownloadSuccessViewProps["lesson"] = {
  lessonTitle: "Transverse waves",
  lessonSlug: "transverse-waves",
  programmeSlug: "combined-science-secondary-ks4-foundation-edexcel",
  unitSlug: "measuring-waves",
  unitTitle: "Measuring waves",
  unitDescription: null,
  lessonReleaseDate: "2025-09-29T14:00:00.000Z",
  lessons,
  unitvariantId: 1,
};

const baseProps = teachersLessonOverviewFixture();
const programmeState = getProgrammeStateForLesson(baseProps);

const renderDownloadSuccessView = (
  props?: Partial<DownloadSuccessViewProps>,
) => {
  return renderWithProviders()(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={{
        programmeState,
      }}
    >
      <DownloadSuccessView
        lesson={baseLesson}
        ctaVariant="control"
        {...props}
      />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};

describe("DownloadSuccessView", () => {
  beforeEach(() => {
    setupMockLinkClick();
    jest.clearAllMocks();
    mockGetConsent.mockImplementation((slug: string) =>
      slug === ServicePolicyMap.GLEAP ? "denied" : "pending",
    );
  });

  afterEach(() => {
    teardownMockLinkClick();
    jest.restoreAllMocks();
  });

  it("renders the confirmation heading and intro copy", () => {
    renderDownloadSuccessView();

    expect(
      screen.getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We hope you find the resources useful/i),
    ).toBeInTheDocument();
  });

  it("back to lesson links to the lesson overview", () => {
    renderDownloadSuccessView();

    const link = screen.getByRole("link", { name: "Back to lesson" });
    expect(link).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        lessonSlug: baseLesson.lessonSlug,
        programmeSlug: baseLesson.programmeSlug,
        unitSlug: baseLesson.unitSlug,
      }),
    );
  });

  it("calls onwardContentSelected when Back to lesson is clicked", async () => {
    const user = userEvent.setup();
    renderDownloadSuccessView();

    await user.click(screen.getByRole("link", { name: "Back to lesson" }));

    expect(mockLinkClick).toHaveBeenCalledWith(
      `http://localhost${resolveOakHref({
        page: "lesson-overview",
        lessonSlug: baseLesson.lessonSlug,
        programmeSlug: baseLesson.programmeSlug,
        unitSlug: baseLesson.unitSlug,
      })}`,
    );
    expect(onwardContentSelected).toHaveBeenCalledTimes(1);
    expect(onwardContentSelected).toHaveBeenCalledWith({
      lessonName: baseLesson.lessonTitle,
      unitName: baseLesson.unitTitle,
      unitSlug: baseLesson.unitSlug,
      lessonSlug: baseLesson.lessonSlug,
      onwardIntent: "view-lesson",
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: baseLesson.lessonReleaseDate,
    });
  });

  it("renders the unit lesson list when lessons and slugs are present", () => {
    const lesson: DownloadSuccessViewProps["lesson"] = {
      ...baseLesson,
      lessons,
      unitDescription: "Unit description text",
    };

    renderDownloadSuccessView({ lesson });

    expect(screen.getByText("Ready to keep going?")).toBeInTheDocument();
    expect(screen.getByText("Measuring wave speed")).toBeInTheDocument();
    expect(screen.getByText("Current lesson")).toBeInTheDocument();
  });

  it("shows extra help copy when statistics (Gleap) consent is granted", () => {
    mockGetConsent.mockImplementation((slug: unknown) =>
      slug === ServicePolicyMap.GLEAP ? "granted" : "pending",
    );
    renderDownloadSuccessView();

    expect(
      screen.getByText(
        /Click the question mark in the bottom-right of the page if you need extra help with this/i,
      ),
    ).toBeInTheDocument();
  });

  it("omits extra help copy when statistics (Gleap) consent is denied", () => {
    mockGetConsent.mockImplementation((slug: unknown) =>
      slug === ServicePolicyMap.GLEAP ? "denied" : "pending",
    );

    renderDownloadSuccessView();

    expect(
      screen.queryByText(
        /Click the question mark in the bottom-right of the page if you need extra help with this/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("renders test variant CTA copy when ctaVariant is test", () => {
    renderDownloadSuccessView({ ctaVariant: "test" });

    expect(
      screen.getByText("Everything you need to plan a unit in one click"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Ready to keep going?")).not.toBeInTheDocument();
  });
});
