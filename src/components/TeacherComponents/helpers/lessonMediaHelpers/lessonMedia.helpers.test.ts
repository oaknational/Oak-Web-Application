import {
  getPlaybackId,
  getPlayingState,
  getTranscript,
  getInitialCurrentClip,
} from "./lessonMedia.helpers";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

describe("lessonMedia helpers", () => {
  describe("getPlaybackId", () => {
    it("should get correct playback id for video clip", () => {
      const clip = lessonMediaClipsFixtures().mediaClips["intro"][0];
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "WfJkoCV01EvqXpkLiaY01axFcTk7O9nurFXrXxZgV02Q004",
      );
    });

    it("should get correct playback id for audio clip", () => {
      const clip = lessonMediaClipsFixtures().mediaClips["intro"][1];
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual("DS00Spx1CV902MCtPj5WknGlR102V5HFkDe");
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
    it("should return undefined if there is no transcript sentences", () => {
      const clip = lessonMediaClipsFixtures().mediaClips["intro"][1];
      const transcript = clip && getTranscript(clip);
      expect(transcript).toEqual(undefined);
    });
  });

  describe("getInitialCurrentClip", () => {
    it("should get initital current clip correctly", () => {
      const listOfAllClips = lessonMediaClipsFixtures().mediaClips["cycle3"];
      const videoQueryParam = "cycle-3-audio";
      const expectedInitialCurrentClip = {
        order: 2,
        learningCycleTitle: "Learning cycle 3",
        mediaClipTitle: "Cycle 3 audio",
        slug: "cycle-3-audio",
        mediaId: 137108,
        mediaObject: {
          muxPlaybackId: "FJ8WDFTLqK9b02U01Vqc4PGMii01Dj6Zu2rsSTambKVLeI",
          playbackPolicy: "signed",
          resourceType: "audio",
          title: "Cycle 3 Audio - Track 30",
          usageRestrictions: "No restrictions",
          attributionRequired: "No attribution required",
          duration: 180.34,
        },
        mediaType: "audio",
        videoId: null,
        videoObject: null,
      };

      expect(getInitialCurrentClip(listOfAllClips, videoQueryParam)).toEqual(
        expectedInitialCurrentClip,
      );
    });
  });
});
