import { render, screen } from "@testing-library/react";

import {
  TeacherBrowseAnalyticsStoreProvider,
  useTeacherBrowseAnalytics,
} from "./TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "./utils/getProgrammeState";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

const getSessionId = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {},
    getSessionId: () => getSessionId(),
  }),
}));

const getConsent = jest.fn();

jest.mock("@oaknational/oak-consent-client", () => {
  const actual = jest.requireActual("@oaknational/oak-consent-client");

  return {
    ...actual,
    useOakConsent: () => ({
      state: { policyConsents: [], requiresInteraction: false },
      logConsents: jest.fn().mockResolvedValue(undefined),
      getConsent: (policy: string) => getConsent(policy),
    }),
  };
});

const reportError = jest.fn();

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const programmeState = getProgrammeStateForLesson(
  teachersLessonOverviewFixture(),
);

const JourneyId = () => {
  const journeyId = useTeacherBrowseAnalytics((store) => store.journeyId);
  return <div data-testid="journey-id">{journeyId ?? "null"}</div>;
};

const renderProvider = () =>
  render(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="lesson"
    >
      <JourneyId />
    </TeacherBrowseAnalyticsStoreProvider>,
  );

const journeyId = () => screen.getByTestId("journey-id").textContent;

describe("TeacherBrowseAnalyticsStoreProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets a journey id when the user has consented and has a session id", () => {
    getConsent.mockReturnValue("granted");
    getSessionId.mockReturnValue("session-1");

    renderProvider();

    expect(getConsent).toHaveBeenCalledWith(ServicePolicyMap.POSTHOG);
    expect(journeyId()).toBe(
      `session-1:${programmeState.phaseSlug}-${programmeState.subjectSlug}`,
    );
    expect(reportError).not.toHaveBeenCalled();
  });

  it("reports an error when the user has consented but has no session id", () => {
    getConsent.mockReturnValue("granted");
    getSessionId.mockReturnValue(undefined);

    renderProvider();

    expect(journeyId()).toBe("null");
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({ message: "Missing session id" }),
      }),
    );
  });

  it.each(["denied", "pending"])(
    "does not report an error when consent is %s and there is no session id",
    (consentState) => {
      getConsent.mockReturnValue(consentState);
      getSessionId.mockReturnValue(undefined);

      renderProvider();

      expect(journeyId()).toBe("null");
      expect(reportError).not.toHaveBeenCalled();
    },
  );

  it("recalculates the journey id when the user's consent state changes", () => {
    getConsent.mockReturnValue("pending");
    getSessionId.mockReturnValue(undefined);

    const { rerender } = renderProvider();

    expect(journeyId()).toBe("null");

    getConsent.mockReturnValue("granted");
    getSessionId.mockReturnValue("session-1");

    rerender(
      <TeacherBrowseAnalyticsStoreProvider
        programmeState={programmeState}
        accessLevel="lesson"
      >
        <JourneyId />
      </TeacherBrowseAnalyticsStoreProvider>,
    );

    expect(journeyId()).toBe(
      `session-1:${programmeState.phaseSlug}-${programmeState.subjectSlug}`,
    );
    expect(reportError).not.toHaveBeenCalled();
  });
});
