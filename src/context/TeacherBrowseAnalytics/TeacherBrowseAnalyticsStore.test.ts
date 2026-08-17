import { TrackFns } from "../Analytics/AnalyticsProvider";

import { createTeacherBrowseAnalyticsStore } from "./TeacherBrowseAnalyticsStore";
import {
  getProgrammeStateForLesson,
  getProgrammeStateForProgramme,
  getProgrammeStateForUnit,
} from "./utils/getProgrammeState";
import { reportAnalyticsError } from "./utils/reportAnalyticsError";

import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import {
  ActiveFilters,
  ComponentType,
  FilterType,
  VideoLocation,
} from "@/browser-lib/avo/Avo";

jest.mock("./utils/reportAnalyticsError", () => ({
  __esModule: true,
  reportAnalyticsError: jest.fn(),
}));

const mockReportAnalyticsError = jest.mocked(reportAnalyticsError);

const createAvoMock = () => {
  return {
    programmeAccessed: jest.fn(),
    unitRefined: jest.fn(),
    videoPlayed: jest.fn(),
    videoStarted: jest.fn(),
    videoPaused: jest.fn(),
    videoFinished: jest.fn(),
  } as unknown as TrackFns;
};

const buildStore = ({
  programmeState,
  accessLevel,
}: {
  programmeState:
    | ReturnType<typeof getProgrammeStateForLesson>
    | ReturnType<typeof getProgrammeStateForUnit>
    | ReturnType<typeof getProgrammeStateForProgramme>;
  accessLevel: "lesson" | "unit" | "programme" | "homepage";
}) => {
  const avo = createAvoMock();
  const store = createTeacherBrowseAnalyticsStore({
    programmeState,
    accessLevel,
    avo,
    journeyId: "journey-1",
  });

  return { store, avo };
};

describe("TeacherBrowseAnalyticsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("programmeAccessed forwards caller-provided filter payload", () => {
    const programmeState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );
    const { store, avo } = buildStore({
      programmeState,
      accessLevel: "lesson",
    });

    const activeFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    } as ActiveFilters;

    store.getState().track.programmeAccessed({
      componentType: ComponentType.ALL_FILTERS,
      activeFilters,
      filterType: FilterType.CONTENT_TYPE_FILTER,
      filterValue: "units",
    });

    expect(avo.programmeAccessed).toHaveBeenCalledWith(
      expect.objectContaining({
        accessLevel: "lesson",
        journeyId: "journey-1",
        engagementIntent: "refine",
        navigationType: "narrow",
        componentType: ComponentType.ALL_FILTERS,
        filterType: FilterType.CONTENT_TYPE_FILTER,
        filterValue: "units",
        activeFilters,
        phase: "secondary",
        subjectSlug: "biology",
      }),
    );
  });

  test("unitRefined uses passed filter payload and unit analytics properties", () => {
    const lessonState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );
    const { store, avo } = buildStore({
      programmeState: lessonState,
      accessLevel: "lesson",
    });

    const activeFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    } as ActiveFilters;

    store.getState().track.unitRefined({
      componentType: ComponentType.UNIT_SEQUENCE_TAB,
      filterType: FilterType.CONTENT_TYPE_FILTER,
      filterValue: "units",
      activeFilters,
    });

    expect(avo.unitRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        accessLevel: "lesson",
        journeyId: "journey-1",
        engagementIntent: "refine",
        componentType: ComponentType.UNIT_SEQUENCE_TAB,
        filterType: FilterType.CONTENT_TYPE_FILTER,
        filterValue: "units",
        activeFilters,
        unitName: "Cells",
        unitSlug: "cells",
      }),
    );
  });

  test("unitRefined on programme-level state omits unit analytics and still tracks", () => {
    const programmeState = getProgrammeStateForProgramme(
      teachersLessonOverviewFixture(),
    );
    const { store, avo } = buildStore({
      programmeState,
      accessLevel: "programme",
    });

    store.getState().track.unitRefined({
      componentType: ComponentType.UNIT_SEQUENCE_TAB,
      filterType: FilterType.CONTENT_TYPE_FILTER,
      filterValue: "units",
      activeFilters: {},
    });

    expect(avo.unitRefined).toHaveBeenCalledWith(
      expect.not.objectContaining({ unitSlug: expect.anything() }),
    );
    expect(avo.unitRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        accessLevel: "programme",
        journeyId: "journey-1",
      }),
    );
  });

  test.each(["programmeAccessed", "unitRefined"] as const)(
    "%s tracks with no passed programmeState",
    (eventName) => {
      const { store, avo } = buildStore({
        programmeState: getProgrammeStateForProgramme(
          teachersLessonOverviewFixture(),
        ),
        accessLevel: "homepage",
      });

      store.getState().track[eventName]({
        componentType: ComponentType.UNIT_SEQUENCE_TAB,
        filterType: FilterType.CONTENT_TYPE_FILTER,
        filterValue: "units",
        activeFilters: {},
      });

      expect(avo[eventName]).toHaveBeenCalledWith(
        expect.objectContaining({
          accessLevel: "homepage",
          journeyId: "journey-1",
          engagementIntent: "refine",
          componentType: ComponentType.UNIT_SEQUENCE_TAB,
          filterType: FilterType.CONTENT_TYPE_FILTER,
          filterValue: "units",
          activeFilters: {},
        }),
      );
    },
  );

  test.each([
    "videoPlayed",
    "videoStarted",
    "videoPaused",
    "videoFinished",
  ] as const)("%s tracks with lesson analytics properties", (eventName) => {
    const lessonState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );
    const { store, avo } = buildStore({
      programmeState: lessonState,
      accessLevel: "lesson",
    });

    const videoPayload = {
      cloudinaryUrl: null,
      muxAssetId: null,
      durationSeconds: 42,
      isCaptioned: true,
      videoPlaybackId: ["playback-id-1"] as string[],
      videoTitle: "Cells overview",
      timeElapsedSeconds: 12,
      isMuted: false,
      videoLocation: VideoLocation.LESSON,
    } as const;

    store.getState().track[eventName](videoPayload);

    expect(avo[eventName]).toHaveBeenCalledWith(
      expect.objectContaining({
        journeyId: "journey-1",
        lessonSlug: "lesson-3-structure-of-cells",
        lessonName: "Structure of cells",
        videoTitle: "Cells overview",
      }),
    );
  });

  test.each([
    "videoPlayed",
    "videoStarted",
    "videoPaused",
    "videoFinished",
  ] as const)(
    "%s reports error and does not track outside lesson level",
    (eventName) => {
      const unitState = getProgrammeStateForUnit(teachersUnitOverviewFixture());
      const { store, avo } = buildStore({
        programmeState: unitState,
        accessLevel: "unit",
      });

      const videoPayload = {
        cloudinaryUrl: null,
        muxAssetId: null,
        durationSeconds: 42,
        isCaptioned: true,
        videoPlaybackId: ["playback-id-1"] as string[],
        videoTitle: "Cells overview",
        timeElapsedSeconds: 12,
        isMuted: false,
        videoLocation: VideoLocation.LESSON,
      } as const;

      store.getState().track[eventName](videoPayload);

      expect(mockReportAnalyticsError).toHaveBeenCalledWith(
        expect.objectContaining({
          event: eventName,
          programmeState: unitState,
        }),
      );
      expect(avo[eventName]).not.toHaveBeenCalled();
    },
  );
});
