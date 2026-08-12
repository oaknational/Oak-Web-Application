import { Platform } from "@/browser-lib/avo/Avo";
import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import { usePupilLessonAnalyticsStore } from "@/context/PupilLessonAnalytics/usePupilLessonAnalyticsStore";
import {
  getPupilPathwayData,
  getPupilVideoData,
} from "@/context/PupilLessonAnalytics/pupilAnalyticsHelpers";
import type { ClassroomAssignmentContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";

const lessonContent = lessonContentFixture({});
const pupilPathwayData = getPupilPathwayData(lessonBrowseDataFixture({}));

const classroomAssignmentContext: ClassroomAssignmentContext = {
  clientEnvironment: "web-browser",
  classroomAssignmentId: "assignment-1",
  courseId: "course-1",
  itemId: "item-1",
  attachmentId: "attachment-1",
  submissionId: null,
  teacherLoginHint: null,
  pupilLoginHint: null,
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
    lessonAccessedPupilJourney: jest.fn(),
    lessonStarted: jest.fn(),
    lessonCompleted: jest.fn(),
    lessonAbandoned: jest.fn(),
    lessonActivityStartedIntroduction: jest.fn(),
    lessonActivityCompletedIntroduction: jest.fn(),
    lessonActivityAbandonedIntroduction: jest.fn(),
    lessonActivityDownloadedWorksheet: jest.fn(),
    lessonActivityStartedStarterQuiz: jest.fn(),
    lessonActivityCompletedStarterQuiz: jest.fn(),
    lessonActivityAbandonedStarterQuiz: jest.fn(),
    lessonActivityStartedExitQuiz: jest.fn(),
    lessonActivityCompletedExitQuiz: jest.fn(),
    lessonActivityAbandonedExitQuiz: jest.fn(),
    lessonActivityStartedLessonVideo: jest.fn(),
    lessonActivityCompletedLessonVideo: jest.fn(),
    lessonActivityAbandonedLessonVideo: jest.fn(),
    questionAttemptSubmitted: jest.fn(),
    lessonSummaryReviewed: jest.fn(),
    activityResultsShared: jest.fn(),
    contentGuidanceAccepted: jest.fn(),
    contentGuidanceDeclined: jest.fn(),
  }) as unknown as jest.Mocked<TrackFns>;

const initialiseStore = ({
  track = createTrack(),
  assignmentContext = classroomAssignmentContext,
  includeLessonContent = true,
}: {
  track?: jest.Mocked<TrackFns>;
  assignmentContext?: ClassroomAssignmentContext;
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
      accessedLessonSlug: null,
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

  it("populates the Google Classroom context and platform on tracked events", () => {
    const track = initialiseStore({
      assignmentContext: {
        clientEnvironment: "iframe",
        classroomAssignmentId: "course-1:item-1",
        courseId: "course-1",
        itemId: "item-1",
        attachmentId: "attachment-1",
        submissionId: "submission-1",
        teacherLoginHint: "teacher-hint",
        pupilLoginHint: "pupil-hint",
      },
    });

    expect(track.lessonAccessedPupilJourney).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: Platform.GOOGLE_CLASSROOM,
        submissionId: "submission-1",
        teacherLoginHint: "teacher-hint",
        pupilLoginHint: "pupil-hint",
        courseId: "course-1",
        itemId: "item-1",
        attachmentId: "attachment-1",
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

  it("skips tracking lesson access when re-initialised for the same lesson slug", () => {
    const trackOne = initialiseStore();
    expect(trackOne.lessonAccessedPupilJourney).toHaveBeenCalledTimes(1);

    const trackTwo = createTrack();
    usePupilLessonAnalyticsStore.getState().initialisePupilLessonAnalytics({
      track: trackTwo,
      pupilPathwayData,
      classroomAssignmentContext,
      lessonContent,
    });

    expect(trackTwo.lessonAccessedPupilJourney).not.toHaveBeenCalled();
  });

  it("tracks lesson started", () => {
    const track = initialiseStore();
    usePupilLessonAnalyticsStore.getState().trackLessonStarted();
    expect(track.lessonStarted).toHaveBeenCalledWith(expectedAdditionalArgs);
  });

  it("tracks lesson completed", () => {
    const track = initialiseStore();
    usePupilLessonAnalyticsStore.getState().trackLessonCompleted();
    expect(track.lessonCompleted).toHaveBeenCalledWith(expectedAdditionalArgs);
  });

  it("tracks intro completed with elapsed time", () => {
    jest.spyOn(Date, "now").mockReturnValue(2500);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore
      .getState()
      .trackIntroCompleted({ sectionStartedAt: 1000 });

    expect(track.lessonActivityCompletedIntroduction).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      pupilExperienceLessonActivity: "intro",
      activityTimeSpent: 1500,
    });
  });

  it("tracks intro abandoned with elapsed time", () => {
    jest.spyOn(Date, "now").mockReturnValue(3000);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore
      .getState()
      .trackIntroAbandoned({ sectionStartedAt: 1000 });

    expect(track.lessonActivityAbandonedIntroduction).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      pupilExperienceLessonActivity: "intro",
      activityTimeSpent: 2000,
    });
  });

  it("tracks worksheet downloaded", () => {
    const track = initialiseStore();
    usePupilLessonAnalyticsStore.getState().trackWorksheetDownloaded();
    expect(track.lessonActivityDownloadedWorksheet).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      pupilExperienceLessonActivity: "intro",
    });
  });

  it.each([
    {
      section: "starter-quiz" as const,
      eventName: "lessonActivityCompletedStarterQuiz" as const,
    },
    {
      section: "exit-quiz" as const,
      eventName: "lessonActivityCompletedExitQuiz" as const,
    },
  ])("tracks $section quiz completed", ({ section, eventName }) => {
    jest.spyOn(Date, "now").mockReturnValue(4000);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackQuizCompleted({
      section,
      sectionResults: {
        [section]: {
          ...sectionResultsFixture[section],
          grade: 5,
          numQuestions: 7,
        },
      } as LessonSectionResults,
      sectionStartedAt: 1000,
    });

    expect(track[eventName]).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      pupilExperienceLessonActivity: section,
      pupilQuizGrade: 5,
      pupilQuizNumQuestions: 7,
      hintQuestion: "",
      hintQuestionResult: "",
      hintUsed: "",
      activityTimeSpent: 3000,
    });
  });

  it.each([
    {
      section: "starter-quiz" as const,
      eventName: "lessonActivityAbandonedStarterQuiz" as const,
    },
    {
      section: "exit-quiz" as const,
      eventName: "lessonActivityAbandonedExitQuiz" as const,
    },
  ])("tracks $section quiz abandoned", ({ section, eventName }) => {
    jest.spyOn(Date, "now").mockReturnValue(5000);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackQuizAbandoned({
      section,
      sectionResults: {
        [section]: {
          ...sectionResultsFixture[section],
          grade: 2,
          numQuestions: 4,
        },
      } as LessonSectionResults,
      sectionStartedAt: 1000,
    });

    expect(track[eventName]).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expectedAdditionalArgs,
        pupilExperienceLessonActivity: section,
        pupilQuizGrade: 2,
        pupilQuizNumQuestions: 4,
        activityTimeSpent: 4000,
      }),
    );
  });

  it("tracks quiz question attempts", () => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackQuizQuestionAttempt({
      section: "starter-quiz",
      questionType: "multiple-choice",
      isCorrect: true,
      hintAvailable: true,
      hintAccessed: false,
      questionNumber: 1,
    });

    expect(track.questionAttemptSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expectedAdditionalArgs,
        pupilExperienceLessonActivity: "starter-quiz",
        questionType: "multiple-choice",
        questionResult: "correct",
        hintOffered: true,
        hintAccessed: false,
        questionNumber: 1,
      }),
    );
  });

  it("marks incorrect quiz attempts in the tracking payload", () => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackQuizQuestionAttempt({
      section: "exit-quiz",
      questionType: "short-answer",
      isCorrect: false,
      hintAvailable: false,
      hintAccessed: false,
      questionNumber: 2,
    });

    expect(track.questionAttemptSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ questionResult: "incorrect" }),
    );
  });

  it("tracks video completed with elapsed time and video state", () => {
    jest.spyOn(Date, "now").mockReturnValue(6000);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackVideoCompleted({
      sectionResults: {
        video: {
          ...sectionResultsFixture.video,
          duration: 200,
          timeElapsed: 180,
          muted: true,
          signedOpened: true,
          transcriptOpened: true,
        },
      } as LessonSectionResults,
      sectionStartedAt: 1000,
    });

    expect(track.lessonActivityCompletedLessonVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        pupilExperienceLessonActivity: "video",
        pupilVideoDurationSeconds: 200,
        pupilVideoTimeElapsedSeconds: 180,
        isMuted: true,
        signedOpened: true,
        transcriptOpened: true,
        activityTimeSpent: 5000,
      }),
    );
  });

  it("tracks video abandoned with elapsed time and video state", () => {
    jest.spyOn(Date, "now").mockReturnValue(7000);
    const track = initialiseStore();

    usePupilLessonAnalyticsStore.getState().trackVideoAbandoned({
      sectionResults: {
        video: {
          ...sectionResultsFixture.video,
          duration: 90,
          timeElapsed: 30,
          muted: false,
        },
      } as LessonSectionResults,
      sectionStartedAt: 2000,
    });

    expect(track.lessonActivityAbandonedLessonVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        pupilExperienceLessonActivity: "video",
        pupilVideoDurationSeconds: 90,
        pupilVideoTimeElapsedSeconds: 30,
        isMuted: false,
        activityTimeSpent: 5000,
      }),
    );
  });

  it("does not track video completed when no video data has been initialised", () => {
    const track = initialiseStore({ includeLessonContent: false });

    usePupilLessonAnalyticsStore.getState().trackVideoCompleted({
      sectionResults: {},
      sectionStartedAt: 1000,
    });

    expect(track.lessonActivityCompletedLessonVideo).not.toHaveBeenCalled();
  });

  it("does not track video abandoned when no video data has been initialised", () => {
    const track = initialiseStore({ includeLessonContent: false });

    usePupilLessonAnalyticsStore.getState().trackVideoAbandoned({
      sectionResults: {},
      sectionStartedAt: 1000,
    });

    expect(track.lessonActivityAbandonedLessonVideo).not.toHaveBeenCalled();
  });

  const reviewArgs = {
    sectionResults: sectionResultsFixture,
    starterQuizQuestionsArray: [],
    exitQuizQuestionsArray: [],
  };

  it("tracks lesson summary reviewed", () => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore
      .getState()
      .trackLessonSummaryReviewed(reviewArgs);

    expect(track.lessonSummaryReviewed).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expectedAdditionalArgs,
        pupilWorksheetAvailable: true,
        pupilWorksheetDownloaded: false,
      }),
    );
  });

  it("tracks activity results shared", () => {
    const track = initialiseStore();

    usePupilLessonAnalyticsStore
      .getState()
      .trackActivityResultsShared(reviewArgs);

    expect(track.activityResultsShared).toHaveBeenCalledWith(
      expect.objectContaining({
        ...expectedAdditionalArgs,
      }),
    );
  });

  it("tracks content guidance accepted", () => {
    const track = initialiseStore();
    const guidanceArgs = { contentGuidanceLabel: "violence" } as never;

    usePupilLessonAnalyticsStore
      .getState()
      .trackContentGuidanceAccepted(guidanceArgs);

    expect(track.contentGuidanceAccepted).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      contentGuidanceLabel: "violence",
    });
  });

  it("tracks content guidance declined", () => {
    const track = initialiseStore();
    const guidanceArgs = { contentGuidanceLabel: "language" } as never;

    usePupilLessonAnalyticsStore
      .getState()
      .trackContentGuidanceDeclined(guidanceArgs);

    expect(track.contentGuidanceDeclined).toHaveBeenCalledWith({
      ...expectedAdditionalArgs,
      contentGuidanceLabel: "language",
    });
  });
});
