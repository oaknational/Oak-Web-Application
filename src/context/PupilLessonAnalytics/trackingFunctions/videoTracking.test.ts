import { trackVideoCompleted } from "./videoTracking";

describe("trackVideoCompleted", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("tracks elapsed activity time from the section start timestamp", () => {
    jest.spyOn(Date, "now").mockReturnValue(2000);
    const lessonActivityCompletedLessonVideo = jest.fn();

    trackVideoCompleted(
      () =>
        ({
          track: { lessonActivityCompletedLessonVideo },
          additionalArgs: {},
          videoData: {},
        }) as never,
      {
        sectionStartedAt: 1250,
        sectionResults: {
          video: {
            isComplete: true,
            played: true,
            duration: 120,
            timeElapsed: 60,
            muted: false,
            signedOpened: false,
            transcriptOpened: true,
          },
        },
      },
    );

    expect(lessonActivityCompletedLessonVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        pupilExperienceLessonActivity: "video",
        activityTimeSpent: 750,
      }),
    );
  });
});
