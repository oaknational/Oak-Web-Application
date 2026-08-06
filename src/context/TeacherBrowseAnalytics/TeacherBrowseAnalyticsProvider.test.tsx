import { render, screen } from "@testing-library/react";

import {
  TeacherBrowseAnalyticsStoreProvider,
  useTeacherBrowseAnalytics,
} from "./TeacherBrowseAnalyticsProvider";
import { TeacherBrowseAnalyticsStore } from "./TeacherBrowseAnalyticsStore";
import {
  getProgrammeStateForLesson,
  getProgrammeStateForProgramme,
  getProgrammeStateForUnit,
} from "./utils/getProgrammeState";
import { ProgrammeState } from "./teacherBrowseAnalytics.types";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

const getSessionId = jest.fn();

const lessonResourceDownloadStarted = jest.fn();
const unitDownloadStarted = jest.fn();
const curriculumExplainerExplored = jest.fn();
const lessonShareStarted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonResourceDownloadStarted: (...args: []) =>
        lessonResourceDownloadStarted(...args),
      unitDownloadStarted: (...args: []) => unitDownloadStarted(...args),
      curriculumExplainerExplored: (...args: []) =>
        curriculumExplainerExplored(...args),
      lessonShareStarted: (...args: []) => lessonShareStarted(...args),
    },
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
  describe("tracking", () => {
    const programmeLevelState = getProgrammeStateForProgramme(
      teachersLessonOverviewFixture(),
    );
    const unitLevelState = getProgrammeStateForUnit(
      teachersUnitOverviewFixture(),
    );
    const lessonLevelState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );

    it("handles lesson level tracking with the correct props", () => {
      renderTrackingTest(lessonLevelState, "lessonResourceDownloadStarted", {
        downloadResourceButtonName: "all",
      });

      const trackBtn = screen.getByRole("button", { name: "Track" });
      trackBtn.click();

      expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          analyticsUseCase: "Teacher",
          componentType: "lesson_download_button",
          downloadResourceButtonName: "all",
          engagementIntent: "use",
          eventVersion: "2.0.0",
          examBoard: null,
          journeyId: "session-1:secondary-biology",
          keyStageSlug: "ks3",
          keyStageTitle: "Key stage 3",
          lessonName: "Structure of cells",
          lessonReleaseCohort: "2023-2026",
          lessonReleaseDate: "2024-09-29T14:00:00.000Z",
          lessonSlug: "lesson-3-structure-of-cells",
          pathway: null,
          phase: "secondary",
          platform: "owa",
          product: "teacher lesson resources",
          releaseGroup: "2023",
          subjectSlug: "biology",
          subjectTitle: "Biology",
          tierName: null,
          unitName: "Cells",
          unitSlug: "cells",
          yearGroupName: "Year 7",
          yearGroupSlug: "year-7",
        }),
      );
    });
    it("handles unit level tracking with the correct props", () => {
      renderTrackingTest(unitLevelState, "unitDownloadStarted");

      const trackBtn = screen.getByRole("button", { name: "Track" });
      trackBtn.click();

      expect(unitDownloadStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          analyticsUseCase: "Teacher",
          componentType: "unit_download_button",
          engagementIntent: "use",
          eventVersion: "2.0.0",
          examBoard: null,
          journeyId: "session-1:secondary-biology",
          keyStageSlug: "ks3",
          keyStageTitle: "Key stage 3",
          pathway: null,
          phase: "secondary",
          platform: "owa",
          product: "teacher lesson resources",
          subjectSlug: "biology",
          subjectTitle: "Biology",
          tierName: null,
          unitName: "Cells",
          unitSlug: "cells",
        }),
      );
    });
    it("handles programe level tracking", () => {
      renderTrackingTest(programmeLevelState, "curriculumExplainerExplored");

      const trackBtn = screen.getByRole("button", { name: "Track" });
      trackBtn.click();

      expect(curriculumExplainerExplored).toHaveBeenCalledWith(
        expect.objectContaining({
          analyticsUseCase: "Teacher",
          componentType: "explainer_tab",
          engagementIntent: "explore",
          eventVersion: "2.0.0",
          journeyId: "session-1:secondary-biology",
          phase: "secondary",
          platform: "owa",
          product: "teacher lesson resources",
          subjectSlug: "biology",
          subjectTitle: "Biology",
        }),
      );
    });
    it("handles invalid browse level for lesson level events", () => {
      renderTrackingTest(programmeLevelState, "lessonShareStarted");

      const trackBtn = screen.getByRole("button", { name: "Track" });
      trackBtn.click();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "analytics/teacher-browse",
          meta: expect.objectContaining({ browseLevel: "programme" }),
        }),
      );
      expect(lessonShareStarted).not.toHaveBeenCalled();
    });
    it("handles invalid browse level for unit level events", () => {
      renderTrackingTest(programmeLevelState, "unitDownloadStarted");
      const trackBtn = screen.getByRole("button", { name: "Track" });
      trackBtn.click();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "analytics/teacher-browse",
          meta: expect.objectContaining({ browseLevel: "programme" }),
        }),
      );
      expect(unitDownloadStarted).not.toHaveBeenCalled();
    });
  });
});

// Helper fn to render a button to test each tracking function in the store
const renderTrackingTest = <
  K extends keyof TeacherBrowseAnalyticsStore["track"],
>(
  programmeState: ProgrammeState,
  eventName: K,
  ...eventProps: Parameters<TeacherBrowseAnalyticsStore["track"][K]>
) => {
  const TrackButton = () => {
    const track = useTeacherBrowseAnalytics((state) => state.track);
    const trackEvent = track[eventName] as (
      ...args: Parameters<TeacherBrowseAnalyticsStore["track"][K]>
    ) => void;
    return <button onClick={() => trackEvent(...eventProps)}>Track</button>;
  };

  return renderWithProviders()(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="lesson"
    >
      <TrackButton />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};
