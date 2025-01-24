import {
  getPlaybackId,
  getPlayingState,
  getInitialCurrentClip,
  joinTranscript,
} from "./lessonMedia.helpers";

import { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

describe("lessonMedia helpers", () => {
  describe("getPlaybackId", () => {
    it("should get correct playback id for video clip", () => {
      const introClips = lessonMediaClipsFixtures()?.mediaClips?.["intro"];
      const clip = introClips ? introClips[0] : null;
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "mVkKUtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeA",
      );
    });

    it("should get correct playback id for audio clip", () => {
      const mediaClips = lessonMediaClipsFixtures()?.mediaClips;
      const introClips = mediaClips ? mediaClips["intro"] : null;
      const clip = introClips ? introClips[1] : null;
      const playbackId = clip && getPlaybackId(clip);
      expect(playbackId).toEqual(
        "02mDhMdHMs4MOCAMutPLWzylp00NQgDYfiydlLQPDWI3M",
      );
    });
  });

  describe("joinTranscript", () => {
    it("should get transcript sentences joined with a space", () => {
      const introClips = {
        ...lessonMediaClipsFixtures()?.mediaClips?.["intro"],
        transcriptSentences: [
          "There will be some transcript sentences here.",
          "Welcome to the lesson.",
        ],
      } as MediaClip;

      const transcript = joinTranscript(introClips);
      expect(transcript).toEqual(
        "There will be some transcript sentences here. Welcome to the lesson.",
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

  describe("getInitialCurrentClip", () => {
    it("should get initital current clip correctly", () => {
      const mediaClips = lessonMediaClipsFixtures()?.mediaClips;
      const listOfAllClips = mediaClips ? mediaClips["cycle3"] : null;
      const addedLearningCycle = listOfAllClips?.map((clips) => {
        return {
          ...clips,
          learningCycle: "Learning cycle 3",
        };
      });

      if (addedLearningCycle) {
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
        expect(
          getInitialCurrentClip(addedLearningCycle, videoQueryParam),
        ).toEqual(expectedInitialCurrentClip);
      }
    });
  });
});
