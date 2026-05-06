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
});
