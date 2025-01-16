import {
  getPlaybackId,
  getPlayingState,
  // getInitialCurrentClip,
} from "./lessonMedia.helpers";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

describe("lessonMedia helpers", () => {
  describe("getPlaybackId", () => {
    it("should get correct playback id for video clip", () => {
      const introClips = lessonMediaClipsFixtures().mediaClips["intro"];
      const clip = introClips ? introClips[0] : null;
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "BW00NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF00",
      );
    });

    it("should get correct playback id for audio clip", () => {
      const introClips = lessonMediaClipsFixtures().mediaClips["intro"];
      const clip = introClips ? introClips[1] : null;
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "9a02PY7PivjOBUHyH4N2mAwJH00aJoZeybWyy9hiwXVQY",
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

  // describe("getTranscript", () => {
  //   it.skip("should get transcript sentences joined with a space", () => {
  //     const introClips = lessonMediaClipsFixtures().mediaClips["intro"];
  //     const clip = introClips ? introClips[0] : null;
  //     const transcript = clip && getTranscript(clip);
  //     expect(transcript).toEqual(
  //       "There will be some transcript sentences here. Welcome to the lesson.",
  //     );
  //   });
  //   it.skip("should return undefined if there is no transcript sentences", () => {
  //     const introClips = lessonMediaClipsFixtures().mediaClips["intro"];
  //     const clip = introClips ? introClips[1] : null;
  //     const transcript = clip && getTranscript(clip);
  //     expect(transcript).toEqual(undefined);
  //   });
  // });

  describe("getInitialCurrentClip", () => {
    // it.skip("should get initital current clip correctly", () => {
    //   const listOfAllClips = lessonMediaClipsFixtures().mediaClips["cycle3"];
    //   console.log(listOfAllClips);
    //   if (listOfAllClips) {
    //     const videoQueryParam = "cycle-3-audio";
    //     const expectedInitialCurrentClip = {
    //       order: 2,
    //       learningCycleTitle: "Learning cycle 3",
    //       mediaClipTitle: "Cycle 3 audio",
    //       slug: "cycle-3-audio",
    //       mediaId: 137108,
    //       mediaObject: {
    //         muxPlaybackId: "FJ8WDFTLqK9b02U01Vqc4PGMii01Dj6Zu2rsSTambKVLeI",
    //         playbackPolicy: "signed",
    //         resourceType: "audio",
    //         title: "Cycle 3 Audio - Track 30",
    //         usageRestrictions: "No restrictions",
    //         attributionRequired: "No attribution required",
    //         duration: 180.34,
    //       },
    //       mediaType: "audio",
    //       videoId: null,
    //       videoObject: null,
    //     };
    //     console.log(listOfAllClips);
    //     expect(getInitialCurrentClip(listOfAllClips, videoQueryParam)).toEqual(
    //       expectedInitialCurrentClip,
    //     );
    //   }
    // });
  });
});
