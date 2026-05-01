import userEvent from "@testing-library/user-event";

import { DownloadConfirmation } from "./DownloadConfirmation";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import type { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { resolveOakHref } from "@/common-lib/urls";
import {
  setupMockLinkClick,
  teardownMockLinkClick,
  mockLinkClick,
} from "@/utils/mockLinkClick";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

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

const baseLesson: LessonDownloadsPageData = lessonDownloadsFixture();

const minimalLessons: NonNullable<LessonDownloadsPageData["lessons"]> = [
  {
    lessonSlug: "lesson-one",
    lessonTitle: "Lesson one",
    description: "Lesson description",
    pupilLessonOutcome: "Outcome",
    expired: false,
    orderInUnit: 1,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: null,
    geoRestricted: false,
    loginRequired: false,
  },
];

describe("DownloadConfirmation", () => {
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
      <DownloadConfirmation lesson={baseLesson} />,
    );

    expect(
      getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
    expect(
      getByText(/We hope you find the resources useful/i),
    ).toBeInTheDocument();
  });

  it("renders Back to lesson with the integrated lesson overview href", () => {
    const { getByTestId } = renderComponent(
      <DownloadConfirmation lesson={baseLesson} />,
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

  it("does not render Back to lesson when unit context is incomplete", () => {
    const lesson = lessonDownloadsFixture({ unitSlug: "" });
    const { queryByTestId } = renderComponent(
      <DownloadConfirmation lesson={lesson} />,
    );

    expect(queryByTestId("back-to-lesson-link")).not.toBeInTheDocument();
  });

  it("calls onwardContentSelected when Back to lesson is clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderComponent(
      <DownloadConfirmation lesson={baseLesson} />,
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

  it("does not render the unit lesson list when lessons are omitted", () => {
    const lesson = lessonDownloadsFixture({ lessons: undefined });
    const { queryByText } = renderComponent(
      <DownloadConfirmation lesson={lesson} />,
    );

    expect(queryByText("Ready to keep going?")).not.toBeInTheDocument();
  });

  it("renders the unit lesson list when lessons and slugs are present", () => {
    const lesson = lessonDownloadsFixture({
      lessons: minimalLessons,
      unitDescription: "Unit description text",
    });
    const { getByText } = renderComponent(
      <DownloadConfirmation lesson={lesson} />,
    );

    expect(getByText("Ready to keep going?")).toBeInTheDocument();
    expect(getByText("Lesson one")).toBeInTheDocument();
  });

  it("shows extra help copy when statistics (Gleap) consent is granted", () => {
    mockGetConsent.mockImplementation((slug: unknown) =>
      slug === ServicePolicyMap.GLEAP ? "granted" : "pending",
    );

    const { getByText } = renderComponent(
      <DownloadConfirmation lesson={baseLesson} />,
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
      <DownloadConfirmation lesson={baseLesson} />,
    );

    expect(
      queryByText(
        /Click the question mark in the bottom-right of the page if you need extra help with this/i,
      ),
    ).not.toBeInTheDocument();
  });
});
