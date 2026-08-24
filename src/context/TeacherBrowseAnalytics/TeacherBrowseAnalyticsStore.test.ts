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
  DownloadResourceButtonName,
  ExamBoardValueType,
  FilterType,
  KeyStageTitleValueType,
  LessonReleaseCohortValueType,
  MediaClipsButtonName,
  OnwardIntent,
  TeachingMaterialType,
  VideoLocation,
} from "@/browser-lib/avo/Avo";

jest.mock("./utils/reportAnalyticsError", () => ({
  __esModule: true,
  reportAnalyticsError: jest.fn(),
}));

const mockReportAnalyticsError = jest.mocked(reportAnalyticsError);

const createAvoMock = () => {
  return {
    createTeachingMaterialsInitiated: jest.fn(),
    curriculumExplainerExplored: jest.fn(),
    curriculumResourcesDownloadRefined: jest.fn(),
    curriculumResourcesDownloaded: jest.fn(),
    lessonAccessed: jest.fn(),
    lessonMediaClipsStarted: jest.fn(),
    lessonResourceDownloadStarted: jest.fn(),
    lessonResourcesDownloaded: jest.fn(),
    lessonShareStarted: jest.fn(),
    mediaClipsPlaylistPlayed: jest.fn(),
    onwardContentSelected: jest.fn(),
    programmeAccessed: jest.fn(),
    teachingMaterialsSelected: jest.fn(),
    unitAccessed: jest.fn(),
    unitDownloaded: jest.fn(),
    unitDownloadStarted: jest.fn(),
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
    | ReturnType<typeof getProgrammeStateForProgramme>
    | null;
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

const mediaClipsPlaylistPayload = {
  learningCycle: null,
  durationSeconds: 10,
  isCaptioned: false,
  videoPlaybackId: ["playback-id-1"],
  videoTitle: "Cells overview",
  timeElapsedSeconds: 1,
  isMuted: false,
  mediaClipsCount: 1,
  mediaClipIndex: 0,
} as const;

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

  test("unitRefined does not include unit analytics properties when accessLevel is programme", () => {
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

  test.each(["lessonAccessed", "unitAccessed"] as const)(
    "%s tracks with lesson analytics properties",
    (eventName) => {
      const lessonState = getProgrammeStateForLesson(
        teachersLessonOverviewFixture(),
      );
      const { store, avo } = buildStore({
        programmeState: lessonState,
        accessLevel: "lesson",
      });

      store.getState().track[eventName]({
        componentType: ComponentType.UNIT_SEQUENCE_TAB,
        unitName: "Cells",
        unitSlug: "cells",
        lessonReleaseCohort: "cohort-1" as LessonReleaseCohortValueType,
        lessonReleaseDate: "2023-01-01",
        lessonName: "Structure of cells",
        lessonSlug: "lesson-3-structure-of-cells",
        keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
        keyStageSlug: "key-stage-4",
        tierName: undefined,
        examBoard: "aqa" as ExamBoardValueType,
        pathway: undefined,
        subjectTitle: "Biology",
        subjectSlug: "biology",
        yearGroupName: "Year 10",
        yearGroupSlug: "year-10",
      });

      expect(avo[eventName]).toHaveBeenCalledWith(
        expect.objectContaining({
          analyticsUseCase: "Teacher",
          componentType: ComponentType.UNIT_SEQUENCE_TAB,
          engagementIntent: "refine",
          eventVersion: "2.0.0",
          examBoard: "aqa",
          keyStageTitle: "Key Stage 4",
          keyStageSlug: "key-stage-4",
          subjectTitle: "Biology",
          subjectSlug: "biology",
          unitName: "Cells",
          unitSlug: "cells",
          tierName: undefined,
          phase: "secondary",
          platform: "owa",
          product: "teacher lesson resources",
          pathway: undefined,
          yearGroupName: "Year 10",
          yearGroupSlug: "year-10",
        }),
      );
    },
  );

  test("lessonResourcesDownloaded tracks with lesson analytics properties and formatted resource details", () => {
    const lessonState = getProgrammeStateForLesson(
      teachersLessonOverviewFixture(),
    );
    const { store, avo } = buildStore({
      programmeState: lessonState,
      accessLevel: "lesson",
    });

    store.getState().track.lessonResourcesDownloaded({
      school: "123456-Test School",
      email: "teacher@example.com",
      terms: true,
      resources: ["worksheet"],
      selectedResources: ["worksheet", "presentation"],
      onwardContent: ["next-lesson-slug"],
      totalDownloadableResources: 5,
    });

    expect(avo.lessonResourcesDownloaded).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: "Teacher",
        platform: "owa",
        product: "teacher lesson resources",
        journeyId: "journey-1",
        componentType: "lesson_download_button",
        engagementIntent: "use",
        subjectSlug: "biology",
        subjectTitle: "Biology",
        unitName: "Cells",
        unitSlug: "cells",
        lessonSlug: "lesson-3-structure-of-cells",
        emailSupplied: true,
        onwardContent: ["next-lesson-slug"],
        resourceType: ["worksheet", "slide deck"],
        totalDownloadableResources: 5,
        schoolOption: "Selected school",
        schoolName: "Test School",
        schoolUrn: "123456",
      }),
    );
  });

  test("lessonResourcesDownloaded reports error and does not track outside lesson level", () => {
    const unitState = getProgrammeStateForUnit(teachersUnitOverviewFixture());
    const { store, avo } = buildStore({
      programmeState: unitState,
      accessLevel: "unit",
    });

    store.getState().track.lessonResourcesDownloaded({
      school: "123456-Test School",
      terms: true,
      resources: ["worksheet"],
      selectedResources: ["worksheet"],
      onwardContent: [],
      totalDownloadableResources: 1,
    });

    expect(mockReportAnalyticsError).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "lessonResourcesDownloaded",
        programmeState: unitState,
      }),
    );
    expect(avo.lessonResourcesDownloaded).not.toHaveBeenCalled();
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

  test.each([
    ["createTeachingMaterialsInitiated", { isLoggedIn: true }],
    [
      "lessonMediaClipsStarted",
      {
        mediaClipsButtonName: MediaClipsButtonName.PLAY_ALL,
        learningCycle: null,
      },
    ],
    [
      "lessonResourceDownloadStarted",
      { downloadResourceButtonName: DownloadResourceButtonName.WORKSHEET },
    ],
    ["lessonShareStarted", undefined],
    ["mediaClipsPlaylistPlayed", mediaClipsPlaylistPayload],
    ["onwardContentSelected", { onwardIntent: OnwardIntent.VIEW_LESSON }],
    [
      "teachingMaterialsSelected",
      { teachingMaterialType: TeachingMaterialType.EXIT_QUIZ },
    ],
  ] as const)(
    "%s reports error and does not track outside lesson level",
    (eventName, payload) => {
      const unitState = getProgrammeStateForUnit(teachersUnitOverviewFixture());
      const { store, avo } = buildStore({
        programmeState: unitState,
        accessLevel: "unit",
      });

      const trackFn = store.getState().track[eventName] as (
        arg?: unknown,
      ) => void;
      trackFn(payload);

      expect(mockReportAnalyticsError).toHaveBeenCalledWith(
        expect.objectContaining({
          event: eventName,
          programmeState: unitState,
        }),
      );
      expect(avo[eventName]).not.toHaveBeenCalled();
    },
  );

  test.each([
    ["videoPlayed", videoPayload],
    ["videoStarted", videoPayload],
    ["videoPaused", videoPayload],
    ["videoFinished", videoPayload],
    ["createTeachingMaterialsInitiated", { isLoggedIn: true }],
    [
      "lessonMediaClipsStarted",
      {
        mediaClipsButtonName: MediaClipsButtonName.PLAY_ALL,
        learningCycle: null,
      },
    ],
    [
      "lessonResourceDownloadStarted",
      { downloadResourceButtonName: DownloadResourceButtonName.WORKSHEET },
    ],
    ["lessonShareStarted", undefined],
    ["mediaClipsPlaylistPlayed", mediaClipsPlaylistPayload],
    ["onwardContentSelected", { onwardIntent: OnwardIntent.VIEW_LESSON }],
    [
      "teachingMaterialsSelected",
      { teachingMaterialType: TeachingMaterialType.EXIT_QUIZ },
    ],
    ["unitDownloaded", undefined],
    ["unitDownloadStarted", undefined],
    ["curriculumExplainerExplored", undefined],
    [
      "curriculumResourcesDownloadRefined",
      { tierSlug: "higher", childSubjectSlug: "biology" },
    ],
    [
      "curriculumResourcesDownloaded",
      { school: "123456-Test School", terms: true, resources: ["worksheet"] },
    ],
  ] as const)(
    "%s reports error and does not track when programmeState is missing",
    (eventName, payload) => {
      const { store, avo } = buildStore({
        programmeState: null,
        accessLevel: "homepage",
      });

      const trackFn = store.getState().track[eventName] as (
        arg?: unknown,
      ) => void;
      trackFn(payload);

      expect(mockReportAnalyticsError).toHaveBeenCalledWith(
        expect.objectContaining({
          event: eventName,
          programmeState: null,
        }),
      );
      expect(avo[eventName]).not.toHaveBeenCalled();
    },
  );
});
