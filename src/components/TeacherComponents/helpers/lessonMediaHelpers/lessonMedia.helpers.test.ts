import {
  getPlaybackId,
  getPlayingState,
  getTranscript,
} from "./lessonMedia.helpers";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

describe("lessonMedia helpers", () => {
  describe("getPlaybackId", () => {
    it("should get playback id", () => {
      const clip = lessonMediaClipsFixtures().mediaClips["intro"][0];
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "muf1AAfWwMkra00gpPPpwcN9gYxRFckwYPbrYcAq001JE",
      );
    });
  });

  describe("getPlayingState", () => {
    it("should get correct playing state", () => {
      const playingState = getPlayingState("clip1", "clip1", []);
      expect(playingState).toEqual("playing");
    });

    it("should get correct standard state", () => {
      const playingState = getPlayingState("clip1", "clip2", []);
      expect(playingState).toEqual("standard");
    });

    it("should get correct played state", () => {
      const playingState = getPlayingState("clip3", "clip1", [
        "clip1",
        "clip2",
      ]);
      expect(playingState).toEqual("played");
    });
  });

  describe("getTranscript", () => {
    it("should get transcript sentences joined with a space", () => {
      const clip = lessonMediaClipsFixtures().mediaClips["intro"][0];
      const transcript = clip && getTranscript(clip);
      expect(transcript).toEqual(
        "There will be some transcript sentences here. Welcome to the lesson.",
      );
    });
  });
});
