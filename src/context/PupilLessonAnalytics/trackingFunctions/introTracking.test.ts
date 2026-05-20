import { trackIntroCompleted } from "./introTracking";

describe("trackIntroCompleted", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("tracks elapsed activity time from the section start timestamp", () => {
    jest.spyOn(Date, "now").mockReturnValue(1500);
    const lessonActivityCompletedIntroduction = jest.fn();

    trackIntroCompleted(
      () =>
        ({
          track: { lessonActivityCompletedIntroduction },
          additionalArgs: {},
        }) as never,
      { sectionStartedAt: 1000 },
    );

    expect(lessonActivityCompletedIntroduction).toHaveBeenCalledWith(
      expect.objectContaining({
        pupilExperienceLessonActivity: "intro",
        activityTimeSpent: 500,
      }),
    );
  });
});
