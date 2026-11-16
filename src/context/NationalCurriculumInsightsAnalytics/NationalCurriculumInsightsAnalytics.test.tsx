import { act, cleanup, renderHook } from "@testing-library/react";
import { nanoid } from "nanoid";
import { type ReactNode } from "react";

import {
  NationalCurriculumInsightsAnalyticsProvider,
  type NationalCurriculumInsightsAnalyticsPage,
} from "./NationalCurriculumInsightsAnalyticsProvider";
import { NationalCurriculumInsightsScrollMarker } from "./NationalCurriculumInsightsScrollMarker";
import { useNationalCurriculumInsightsAnalytics } from "./useNationalCurriculumInsightsAnalytics";
import { getDownloadAnalyticsProperties } from "./getDownloadAnalyticsProperties";
import { INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS } from "./useInsightsDwellTime";

import { analyticsContext } from "@/context/Analytics/AnalyticsProvider";
import { getMockAnalytics } from "@/context/Analytics/getMockAnalytics";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("nanoid", () => ({ nanoid: jest.fn() }));

const page: NationalCurriculumInsightsAnalyticsPage = {
  pageName: "Landing Page",
  pageType: "subjectPhaseKeyStage",
  subjectTitle: "Science",
  subjectSlug: "science",
  phase: "primary",
  keyStageTitle: "Key stage 1",
  keyStageSlug: "key-stage-1",
};

describe("National Curriculum Insights scroll analytics", () => {
  const ncInsightsScrollMilestoneReached = jest.fn();
  const scrolledTo = jest.fn();
  const ncInsightsDownloadCompleted = jest.fn();
  const ncInsightsDwellTimeRecorded = jest.fn();
  const ncInsightsDwellThresholdReached = jest.fn();
  const ncInsightsEngagementCriteriaMet = jest.fn();
  let now: number;
  let visibility: DocumentVisibilityState;
  const disconnect = jest.fn();
  let notifyIntersection: IntersectionObserverCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    now = 0;
    visibility = "visible";
    jest.spyOn(performance, "now").mockImplementation(() => now);
    jest
      .spyOn(document, "visibilityState", "get")
      .mockImplementation(() => visibility);
    jest
      .mocked(nanoid)
      .mockReset()
      .mockReturnValueOnce("visit-1")
      .mockReturnValueOnce("visit-2");
    jest
      .spyOn(window, "IntersectionObserver")
      .mockImplementation((callback) => {
        notifyIntersection = callback;
        return {
          observe: jest.fn(),
          disconnect,
        } as unknown as IntersectionObserver;
      });
  });

  afterEach(() => jest.restoreAllMocks());

  const renderVisit = (
    visitId = "first",
    currentPage = page,
    children: ReactNode = <NationalCurriculumInsightsScrollMarker />,
  ) => (
    <analyticsContext.Provider
      value={{
        ...getMockAnalytics(),
        track: {
          ...getMockAnalytics().track,
          scrolledTo,
          ncInsightsScrollMilestoneReached,
          ncInsightsDownloadCompleted,
          ncInsightsDwellTimeRecorded,
          ncInsightsDwellThresholdReached,
          ncInsightsEngagementCriteriaMet,
        },
      }}
    >
      <NationalCurriculumInsightsAnalyticsProvider
        key={visitId}
        page={currentPage}
      >
        {children}
      </NationalCurriculumInsightsAnalyticsProvider>
    </analyticsContext.Provider>
  );

  const intersect = (isIntersecting: boolean) =>
    act(() =>
      notifyIntersection(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );

  it("sends the full Avo payload only when the checklist is reached, once per visit", () => {
    const { unmount } = renderWithTheme(renderVisit());
    intersect(false);
    expect(ncInsightsScrollMilestoneReached).not.toHaveBeenCalled();
    intersect(true);
    intersect(true);
    expect(ncInsightsScrollMilestoneReached).toHaveBeenCalledTimes(1);
    expect(ncInsightsScrollMilestoneReached).toHaveBeenCalledWith({
      ...page,
      platform: "owa",
      product: "curriculum resources",
      engagementIntent: "explore",
      sectionId: "teacher-checklist",
      measurementType: "section_visibility",
      pageVisitId: "visit-1",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
    });
    expect(scrolledTo).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("keeps deduplication across rerenders and resets it for a new page visit", () => {
    const { rerender } = renderWithTheme(renderVisit());
    intersect(true);
    rerender(renderVisit());
    intersect(true);
    expect(ncInsightsScrollMilestoneReached).toHaveBeenCalledTimes(1);
    rerender(
      renderVisit("second", {
        ...page,
        keyStageTitle: "Key stage 2",
        keyStageSlug: "key-stage-2",
      }),
    );
    intersect(true);
    expect(ncInsightsScrollMilestoneReached).toHaveBeenCalledTimes(2);
    expect(ncInsightsScrollMilestoneReached).toHaveBeenLastCalledWith(
      expect.objectContaining({
        keyStageTitle: "Key stage 2",
        keyStageSlug: "key-stage-2",
        pageVisitId: "visit-2",
      }),
    );
  });

  it("requires the feature provider", () => {
    const silenceReactError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() =>
      renderHook(() => useNationalCurriculumInsightsAnalytics()),
    ).toThrow(
      "useNationalCurriculumInsightsAnalytics must be used within NationalCurriculumInsightsAnalyticsProvider",
    );
    silenceReactError.mockRestore();
  });

  it("automatically records cumulative visible dwell time with shared page context", () => {
    const { result, unmount } = renderHook(
      () => useNationalCurriculumInsightsAnalytics(),
      {
        wrapper: ({ children }) => renderVisit("first", page, children),
      },
    );
    act(() => result.current.trackScrolledTo("teacher-checklist"));
    expect(ncInsightsDwellTimeRecorded).not.toHaveBeenCalled();
    now = 12000;
    visibility = "hidden";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledWith({
      ...page,
      timeElapsedSeconds: 12,
      measurementType: "visible_page_time",
      pageVisitId: "visit-1",
      platform: "owa",
      product: "curriculum resources",
      engagementIntent: "explore",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
    });
    now = 72000;
    visibility = "visible";
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    now = 75000;
    unmount();
    expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledTimes(2);
    expect(ncInsightsDwellTimeRecorded).toHaveBeenLastCalledWith(
      expect.objectContaining({
        timeElapsedSeconds: 15,
        pageVisitId: "visit-1",
      }),
    );
  });

  it("resets dwell time and the page visit ID when navigating between Insights pages", () => {
    const { rerender, unmount } = renderWithTheme(renderVisit());
    now = 5000;
    rerender(
      renderVisit("second", {
        ...page,
        keyStageSlug: "key-stage-2",
        keyStageTitle: "Key stage 2",
      }),
    );
    expect(ncInsightsDwellTimeRecorded).toHaveBeenLastCalledWith(
      expect.objectContaining({
        timeElapsedSeconds: 5,
        keyStageSlug: "key-stage-1",
        pageVisitId: "visit-1",
      }),
    );
    now = 8000;
    unmount();
    expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledTimes(2);
    expect(ncInsightsDwellTimeRecorded).toHaveBeenLastCalledWith(
      expect.objectContaining({
        timeElapsedSeconds: 3,
        keyStageSlug: "key-stage-2",
        pageVisitId: "visit-2",
      }),
    );
  });

  it("records dwell time from a hub page with nullable context", () => {
    const { unmount } = renderWithTheme(
      renderVisit(
        "hub",
        {
          ...page,
          pageType: "hub",
          subjectTitle: null,
          subjectSlug: null,
          phase: null,
          keyStageTitle: null,
          keyStageSlug: null,
        },
        null,
      ),
    );
    now = 20000;
    unmount();
    expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledTimes(1);
    expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledWith(
      expect.objectContaining({
        pageType: "hub",
        subjectTitle: null,
        subjectSlug: null,
        phase: null,
        keyStageTitle: null,
        keyStageSlug: null,
        timeElapsedSeconds: 20,
      }),
    );
  });

  it("automatically sends the threshold event at four visible minutes using the same visit ID", () => {
    jest.useFakeTimers();
    // Fake timers replace performance.now, so retain the controlled monotonic clock.
    jest.spyOn(performance, "now").mockImplementation(() => now);
    const { result, unmount } = renderHook(
      () => useNationalCurriculumInsightsAnalytics(),
      { wrapper: ({ children }) => renderVisit("first", page, children) },
    );
    try {
      act(() => result.current.trackScrolledTo("teacher-checklist"));
      const surveyThresholdMs = INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS * 1000;
      act(() => {
        now = surveyThresholdMs;
        jest.advanceTimersByTime(surveyThresholdMs);
      });
      expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledTimes(1);
      expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledWith(
        expect.objectContaining({
          timeElapsedSeconds: INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS,
          pageVisitId: "visit-1",
        }),
      );
      expect(ncInsightsDwellThresholdReached).not.toHaveBeenCalled();
      act(() => {
        now = 239999;
        jest.advanceTimersByTime(239999 - surveyThresholdMs);
      });
      expect(ncInsightsDwellThresholdReached).not.toHaveBeenCalled();
      act(() => {
        now = 240000;
        jest.advanceTimersByTime(1);
      });
      expect(ncInsightsDwellThresholdReached).toHaveBeenCalledTimes(1);
      expect(ncInsightsDwellThresholdReached).toHaveBeenCalledWith({
        ...page,
        dwellThresholdSeconds: 240,
        timeElapsedSeconds: 240,
        measurementType: "visible_page_time",
        pageVisitId: "visit-1",
        platform: "owa",
        product: "curriculum resources",
        engagementIntent: "explore",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
      });
      unmount();
      expect(ncInsightsDwellThresholdReached).toHaveBeenCalledTimes(1);
      expect(ncInsightsDwellTimeRecorded).toHaveBeenCalledWith(
        expect.objectContaining({
          timeElapsedSeconds: 240,
          pageVisitId: "visit-1",
        }),
      );
    } finally {
      unmount();
      jest.useRealTimers();
    }
  });

  it("shares the page visit ID with downloads and records a completion only once per attempt", () => {
    const { result } = renderHook(
      () => useNationalCurriculumInsightsAnalytics(),
      {
        wrapper: ({ children }) => renderVisit("first", page, children),
      },
    );
    const details = getDownloadAnalyticsProperties({
      selectedValues: ["english:secondary"],
      email: "",
      schoolOption: "Selected school",
      schoolUrn: "101105",
      downloadAttemptId: "attempt-1",
    });
    act(() => {
      result.current.trackScrolledTo("teacher-checklist");
      result.current.trackDownloadCompleted(details);
      result.current.trackDownloadCompleted(details);
    });
    expect(ncInsightsDownloadCompleted).toHaveBeenCalledTimes(1);
    expect(ncInsightsDownloadCompleted).toHaveBeenCalledWith({
      ...page,
      ...details,
      pageVisitId: "visit-1",
      platform: "owa",
      product: "curriculum resources",
      engagementIntent: "use",
      componentType: "download_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
    });
  });

  describe("combined engagement", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(performance, "now").mockImplementation(() => now);
    });

    afterEach(() => {
      cleanup();
      jest.useRealTimers();
    });

    const advance = (milliseconds: number) =>
      act(() => {
        now += milliseconds;
        jest.advanceTimersByTime(milliseconds);
      });

    it("fires once when the checklist is reached before four visible minutes", () => {
      const { unmount } = renderWithTheme(renderVisit());
      intersect(true);
      advance(239999);
      expect(ncInsightsEngagementCriteriaMet).not.toHaveBeenCalled();
      advance(1);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledWith({
        ...page,
        scrollMeasurementType: "section_visibility",
        scrollThresholdPercent: null,
        dwellThresholdSeconds: 240,
        timeElapsedSeconds: 240,
        pageVisitId: "visit-1",
        platform: "owa",
        product: "curriculum resources",
        engagementIntent: "explore",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
      });
      intersect(true);
      advance(60000);
      visibility = "hidden";
      act(() => document.dispatchEvent(new Event("visibilitychange")));
      act(() => window.dispatchEvent(new Event("pagehide")));
      unmount();
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
    });

    it("waits for the checklist when dwell is reached first and reports current visible time", () => {
      renderWithTheme(renderVisit());
      advance(240000);
      expect(ncInsightsDwellThresholdReached).toHaveBeenCalledTimes(1);
      expect(ncInsightsEngagementCriteriaMet).not.toHaveBeenCalled();
      advance(30000);
      intersect(true);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledWith(
        expect.objectContaining({
          timeElapsedSeconds: 270,
          pageVisitId: "visit-1",
        }),
      );
    });

    it("requires the teacher checklist rather than an unrelated scroll milestone", () => {
      const { result } = renderHook(
        () => useNationalCurriculumInsightsAnalytics(),
        { wrapper: ({ children }) => renderVisit("first", page, children) },
      );
      act(() => result.current.trackScrolledTo("school-leader-checklist"));
      advance(240000);
      expect(ncInsightsEngagementCriteriaMet).not.toHaveBeenCalled();
      act(() => result.current.trackScrolledTo("teacher-checklist"));
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
    });

    it("excludes hidden-tab time from the combined criterion", () => {
      renderWithTheme(renderVisit());
      intersect(true);
      advance(120000);
      visibility = "hidden";
      act(() => document.dispatchEvent(new Event("visibilitychange")));
      advance(600000);
      expect(ncInsightsEngagementCriteriaMet).not.toHaveBeenCalled();
      visibility = "visible";
      act(() => document.dispatchEvent(new Event("visibilitychange")));
      advance(120000);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledWith(
        expect.objectContaining({ timeElapsedSeconds: 240 }),
      );
    });

    it.each(["scroll", "dwell"])(
      "does not combine %s on one page with the other criterion on another",
      (firstCriterion) => {
        const { rerender } = renderWithTheme(renderVisit());
        if (firstCriterion === "scroll") intersect(true);
        else advance(240000);
        rerender(
          renderVisit("second", {
            ...page,
            keyStageSlug: "key-stage-2",
            keyStageTitle: "Key stage 2",
          }),
        );
        if (firstCriterion === "scroll") advance(240000);
        else intersect(true);
        expect(ncInsightsEngagementCriteriaMet).not.toHaveBeenCalled();
        if (firstCriterion === "scroll") intersect(true);
        else advance(240000);
        expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
        expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledWith(
          expect.objectContaining({
            keyStageSlug: "key-stage-2",
            pageVisitId: "visit-2",
            timeElapsedSeconds: 240,
          }),
        );
      },
    );

    it("records combined engagement on exit if the threshold timer was delayed", () => {
      const { unmount } = renderWithTheme(renderVisit());
      intersect(true);
      now = 250000;
      act(() => window.dispatchEvent(new Event("pagehide")));
      unmount();
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledWith(
        expect.objectContaining({ timeElapsedSeconds: 250 }),
      );
    });

    it("allows a later page visit to qualify independently after an earlier completion", () => {
      const { rerender } = renderWithTheme(renderVisit());
      intersect(true);
      advance(240000);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(1);
      rerender(renderVisit("second"));
      intersect(true);
      advance(240000);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenCalledTimes(2);
      expect(ncInsightsEngagementCriteriaMet).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pageVisitId: "visit-2",
          timeElapsedSeconds: 240,
        }),
      );
    });
  });

  it("records hub downloads with null source context while keeping the selected subjects", () => {
    const hubPage: NationalCurriculumInsightsAnalyticsPage = {
      ...page,
      pageType: "hub",
      subjectSlug: null,
      subjectTitle: null,
      phase: null,
      keyStageSlug: null,
      keyStageTitle: null,
    };
    const { result } = renderHook(
      () => useNationalCurriculumInsightsAnalytics(),
      {
        wrapper: ({ children }) => renderVisit("hub", hubPage, children),
      },
    );
    act(() =>
      result.current.trackDownloadCompleted(
        getDownloadAnalyticsProperties({
          selectedValues: ["science:primary", "science:secondary"],
          email: "teacher@example.com",
          schoolOption: "Homeschool",
          schoolUrn: null,
          downloadAttemptId: "attempt-2",
        }),
      ),
    );
    expect(ncInsightsDownloadCompleted).toHaveBeenCalledWith(
      expect.objectContaining({
        ...hubPage,
        selectedSubjectSlugs: ["science"],
        selectedPhases: ["primary", "secondary"],
        documentCount: 2,
        fileFormat: "zip",
      }),
    );
    expect(ncInsightsScrollMilestoneReached).not.toHaveBeenCalled();
  });
});
