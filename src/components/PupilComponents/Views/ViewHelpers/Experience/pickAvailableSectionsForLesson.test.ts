import { pickAvailableSectionsForLesson } from "./pickAvailableSectionsForLesson";

describe("pickAvailableSectionsForLesson", () => {
  it("always includes intro", () => {
    expect(
      pickAvailableSectionsForLesson({
        starterQuiz: [],
        exitQuiz: [],
        videoMuxPlaybackId: null,
      } as never),
    ).toEqual(["intro"]);
  });

  it("includes quiz and video sections when lesson content is available", () => {
    expect(
      pickAvailableSectionsForLesson({
        starterQuiz: [{}],
        exitQuiz: [{}],
        videoMuxPlaybackId: "playback-id",
      } as never),
    ).toEqual(["intro", "starter-quiz", "video", "exit-quiz"]);
  });

  it("restricts sections to the variant's allowed list", () => {
    expect(
      pickAvailableSectionsForLesson(
        {
          starterQuiz: [{}],
          exitQuiz: [{}],
          videoMuxPlaybackId: "playback-id",
        } as never,
        { sections: ["intro", "video"], reviewSections: [] } as never,
      ),
    ).toEqual(["intro", "video"]);
  });

  it("uses the variant's review sections when isReview is true", () => {
    expect(
      pickAvailableSectionsForLesson(
        {
          starterQuiz: [{}],
          exitQuiz: [{}],
          videoMuxPlaybackId: "playback-id",
        } as never,
        {
          sections: [],
          reviewSections: ["intro", "starter-quiz", "exit-quiz"],
        } as never,
        true,
      ),
    ).toEqual(["intro", "starter-quiz", "exit-quiz"]);
  });
});
