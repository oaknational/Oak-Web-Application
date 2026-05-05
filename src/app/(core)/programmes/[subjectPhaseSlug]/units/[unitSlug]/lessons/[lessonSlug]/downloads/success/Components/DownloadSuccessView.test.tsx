import userEvent from "@testing-library/user-event";

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

globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });

const onwardContentSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      onwardContentSelected: (...args: unknown[]) =>
        onwardContentSelected(...args),
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
  keyStageSlug: "ks4",
  keyStageTitle: "Key Stage 4",
  subjectSlug: "combined-science",
  subjectTitle: "Combined science",
};

describe("DownloadSuccessView", () => {
  const renderComponent = renderWithProviders();

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
    const { getByRole, getByText } = renderComponent(
      <DownloadSuccessView lesson={baseLesson} />,
    );

    expect(
      getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
    expect(
      getByText(/We hope you find the resources useful/i),
    ).toBeInTheDocument();
  });

  it("back to lesson links to the lesson overview", () => {
    const { getByTestId } = renderComponent(
      <DownloadSuccessView lesson={baseLesson} />,
    );

    const link = getByTestId("back-to-lesson-link");
    expect(link).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
        lessonSlug: baseLesson.lessonSlug,
        programmeSlug: baseLesson.programmeSlug,
        unitSlug: baseLesson.unitSlug,
      }),
    );
  });

  it("calls onwardContentSelected when Back to lesson is clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderComponent(
      <DownloadSuccessView lesson={baseLesson} />,
    );

    await user.click(getByRole("link", { name: "Back to lesson" }));

    expect(mockLinkClick).toHaveBeenCalledWith(
      `http://localhost${resolveOakHref({
        page: "integrated-lesson-overview",
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
    const { getByText } = renderComponent(
      <DownloadSuccessView lesson={lesson} />,
    );

    expect(getByText("Ready to keep going?")).toBeInTheDocument();
    expect(getByText("Measuring wave speed")).toBeInTheDocument();
    expect(getByText("Current lesson")).toBeInTheDocument();
  });

  it("shows extra help copy when statistics (Gleap) consent is granted", () => {
    mockGetConsent.mockImplementation((slug: unknown) =>
      slug === ServicePolicyMap.GLEAP ? "granted" : "pending",
    );

    const { getByText } = renderComponent(
      <DownloadSuccessView lesson={baseLesson} />,
    );

    expect(
      getByText(
        /Click the question mark in the bottom-right of the page if you need extra help with this/i,
      ),
    ).toBeInTheDocument();
  });

  it("omits extra help copy when statistics (Gleap) consent is denied", () => {
    mockGetConsent.mockImplementation((slug: unknown) =>
      slug === ServicePolicyMap.GLEAP ? "denied" : "pending",
    );

    const { queryByText } = renderComponent(
      <DownloadSuccessView lesson={baseLesson} />,
    );

    expect(
      queryByText(
        /Click the question mark in the bottom-right of the page if you need extra help with this/i,
      ),
    ).not.toBeInTheDocument();
  });
});
