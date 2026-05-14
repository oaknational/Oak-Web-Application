import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import { usePupilLessonAnalyticsStore } from "@/context/PupilLessonAnalytics/usePupilLessonAnalyticsStore";
import {
  getPupilPathwayData,
  getPupilVideoData,
  type PupilAnalyticsProviderClassroomContext,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";

const lessonContent = lessonContentFixture({});
const pupilPathwayData = getPupilPathwayData(lessonBrowseDataFixture({}));

const classroomAssignmentContext: PupilAnalyticsProviderClassroomContext = {
  clientEnvironment: "web-browser",
  classroomAssignmentId: "assignment-1",
  courseId: "course-1",
  itemId: "item-1",
  attachmentId: "attachment-1",
};

const expectedAdditionalArgs = {
  ...pupilPathwayData,
  analyticsUseCase: "Pupil",
  clientEnvironment: "web-browser",
  classroomAssignmentId: "assignment-1",
  courseId: "course-1",
  itemId: "item-1",
  attachmentId: "attachment-1",
  submissionId: null,
  teacherLoginHint: null,
  pupilLoginHint: null,
};

const expectedVideoData = getPupilVideoData(lessonContent);

const createTrack = () =>
  ({
    lessonActivityStartedIntroduction: jest.fn(),
    lessonActivityStartedStarterQuiz: jest.fn(),
    lessonActivityStartedLessonVideo: jest.fn(),
    lessonActivityStartedExitQuiz: jest.fn(),
    lessonAbandoned: jest.fn(),
    lessonAccessedPupilJourney: jest.fn(),
  }) as unknown as jest.Mocked<TrackFns>;

const initialiseStore = ({
  track = createTrack(),
  assignmentContext = classroomAssignmentContext,
  includeLessonContent = true,
}: {
  track?: jest.Mocked<TrackFns>;
  assignmentContext?: PupilAnalyticsProviderClassroomContext;
  includeLessonContent?: boolean;
} = {}) => {
  usePupilLessonAnalyticsStore.getState().initialisePupilLessonAnalytics({
    track,
    pupilPathwayData,
    classroomAssignmentContext: assignmentContext,
    ...(includeLessonContent ? { lessonContent } : {}),
  });

  return track;
};

describe("usePupilLessonAnalyticsStore", () => {
  beforeEach(() => {
    usePupilLessonAnalyticsStore.setState({
      track: null,
      additionalArgs: null,
      videoData: null,
    });
  });

  it("initialises state with lesson analytics data", () => {
    const track = initialiseStore();

    expect(usePupilLessonAnalyticsStore.getState()).toEqual(
      expect.objectContaining({
        track,
        additionalArgs: expectedAdditionalArgs,
        videoData: expectedVideoData,
      }),
    );
  });

  it("does not track section starts or abandoned lessons before initialisation", () => {
    expect(() => {
      usePupilLessonAnalyticsStore.getState().trackSectionStarted({
        section: "intro",
        sectionResults: {},
      });
      usePupilLessonAnalyticsStore.getState().trackLessonAbandoned();
    }).not.toThrow();
  });

  it.each([
    {
      section: "intro" as const,
      sectionResults: {},
      eventName: "lessonActivityStartedIntroduction" as const,
      payload: {
        pupilExperienceLessonActivity: "intro",
      },
    },
    {
      section: "starter-quiz" as const,
      sectionResults: {
        "starter-quiz": {
          ...sectionResultsFixture["starter-quiz"],
          isComplete: false,
          grade: 3,
          numQuestions: 5,
        },
      },
      eventName: "lessonActivityStartedStarterQuiz" as const,
      payload: {
        pupilExperienceLessonActivity: "starter-quiz",
        pupilQuizGrade: 3,
        pupilQuizNumQuestions: 5,
        hintAvailable: true,
      },
    },
    {
      section: "starter-quiz" as const,
      sectionResults: {},
      eventName: "lessonActivityStartedStarterQuiz" as const,
      payload: {
        pupilExperienceLessonActivity: "starter-quiz",
        pupilQuizGrade: 0,
        pupilQuizNumQuestions: 0,
        hintAvailable: true,
      },
    },
    {
      section: "exit-quiz" as const,
      sectionResults: {
        "exit-quiz": {
          ...sectionResultsFixture["exit-quiz"],
          isComplete: false,
          grade: 4,
          numQuestions: 6,
        },
      },
      eventName: "lessonActivityStartedExitQuiz" as const,
      payload: {
        pupilExperienceLessonActivity: "exit-quiz",
        pupilQuizGrade: 4,
        pupilQuizNumQuestions: 6,
        hintAvailable: true,
      },
    },
    {
      section: "exit-quiz" as const,
      sectionResults: {},
      eventName: "lessonActivityStartedExitQuiz" as const,
      payload: {
        pupilExperienceLessonActivity: "exit-quiz",
        pupilQuizGrade: 0,
        pupilQuizNumQuestions: 0,
        hintAvailable: true,
      },
    },
    {
      section: "video" as const,
      sectionResults: {
        video: {
          ...sectionResultsFixture.video,
          isComplete: false,
          duration: 120,
          played: true,
        },
      } as LessonSectionResults,
      eventName: "lessonActivityStartedLessonVideo" as const,
      payload: {
        ...expectedVideoData,
        pupilExperienceLessonActivity: "video",
        pupilVideoDurationSeconds: 120,
        pupilVideoPlayed: true,
      },
    },
    {
      section: "video" as const,
      sectionResults: {},
      eventName: "lessonActivityStartedLessonVideo" as const,
      payload: {
        ...expectedVideoData,
        pupilExperienceLessonActivity: "video",
        pupilVideoDurationSeconds: 0,
        pupilVideoPlayed: false,
      },
    },
  ])("tracks an incomplete $section section start", (args) => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackSectionStarted({
      section: args.section,
      sectionResults: args.sectionResults,
    });

    expect(track[args.eventName]).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      ...args.payload,
    });
  });

  it("does not track starts for sections that are already complete", () => {
    const track = initialiseStore();

    [
      {
        section: "intro" as const,
        sectionResults: { intro: sectionResultsFixture.intro },
      },
      {
        section: "starter-quiz" as const,
        sectionResults: {
          "starter-quiz": sectionResultsFixture["starter-quiz"],
        },
      },
      {
        section: "exit-quiz" as const,
        sectionResults: {
          "exit-quiz": sectionResultsFixture["exit-quiz"],
        },
      },
      {
        section: "video" as const,
        sectionResults: { video: sectionResultsFixture.video },
      },
    ].forEach((args) => {
      usePupilLessonAnalyticsStore.getState().trackSectionStarted(args);
    });

    expect(track.lessonActivityStartedIntroduction).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedStarterQuiz).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedLessonVideo).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedExitQuiz).not.toHaveBeenCalled();
  });

  it("does not track starts for review sections", () => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackSectionStarted({
      section: "review",
      sectionResults: {},
    });

    expect(track.lessonActivityStartedIntroduction).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedStarterQuiz).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedLessonVideo).not.toHaveBeenCalled();
    expect(track.lessonActivityStartedExitQuiz).not.toHaveBeenCalled();
  });

  it("does not track video starts when video data is unavailable", () => {
    const track = initialiseStore({ includeLessonContent: false });

    usePupilLessonAnalyticsStore.getState().trackSectionStarted({
      section: "video",
      sectionResults: {},
    });

    expect(track.lessonActivityStartedLessonVideo).not.toHaveBeenCalled();
  });

  it.each([
    {
      clientEnvironment: "web-browser" as const,
      platform: "owa",
    },
    {
      clientEnvironment: "iframe" as const,
      platform: "google-classroom",
    },
  ])(
    "tracks abandoned lessons with $clientEnvironment core properties",
    ({ clientEnvironment, platform }) => {
      const track = initialiseStore({
        assignmentContext: {
          ...classroomAssignmentContext,
          clientEnvironment,
        },
      });

      usePupilLessonAnalyticsStore.getState().trackLessonAbandoned();

      expect(track.lessonAbandoned).toHaveBeenCalledWith({
        ...expectedAdditionalArgs,
        clientEnvironment,
        platform,
        product: "pupil lesson activities",
        engagementIntent: "use",
        eventVersion: "2.0.0",
      });
    },
  );
});
