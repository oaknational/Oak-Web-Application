import { mediaClipsFixture } from "@oaknational/oak-curriculum-schema";

import {
  LessonMediaClipsData,
  MediaClipListCamelCase,
} from "../queries/lessonMediaClips/lessonMediaClips.schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";

const lessonMediaClipsFixtures = (
  partial?: Partial<LessonMediaClipsData>,
): LessonMediaClipsData => {
  return {
    programmeSlug: "physical-education-ks4",
    lessonSlug: "running-as-a-team",
    lessonTitle: "Running as a team",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    unitSlug: "running-and-jumping",
    unitTitle: "Running and jumping",
    subjectSlug: "physical-education",
    subjectTitle: "Physical Education",
    examBoardSlug: null,
    examBoardTitle: null,
    tierSlug: null,
    tierTitle: null,
    mediaClips: keysToCamelCase(
      mediaClipsFixture().media_clips,
    ) as MediaClipListCamelCase,
    lessonOutline: [
      { lessonOutline: "This lesson is about running as a team" },
    ],
    ...partial,
  };
};

export const additionalCycles = {
  cycle3: [
    {
      order: "1",
      mediaId: "2321312",
      customTitle: "Cycle3 Video 1",
      mediaObject: {
        id: "4de4d70775b95bbc722d4d259fb033ad",
        url: "http://example.com/video1.mp3",
        type: "upload",
        bytes: 81127,
        width: 0,
        format: "mp3",
        height: 0,
        version: 1736860290,
        duration: 5.041633,
        metadata: {
          assetType: "audio_speech",
          sourceType: "partner_created",
          assetSource: "partner_created",
          licenceType: "no_licence",
          contentCycle: "cycle_2",
          permissionGranted: "notRequired",
        },
        secureUrl: "https://example.com/video1.mp3",
        accessMode: "public",
        assetFolder:
          "Cycle 2 assets/MFL - French - Secondary/Audio/Y7/FR7U15/FR7U15L1",
        displayName: "9_task_C1_3",
        resourceType: "video",
      },
      mediaType: "video",
      videoId: 33,
      videoObject: {
        id: "hug9i01Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav3mg",
        status: "ready",
        tracks: [
          {
            id: "32v67aMKIr5Z014b3n3AVwNHjAPnWSuhJCm008E026lYOQ",
            type: "audio",
            duration: 5.041633,
          },
          {
            id: "staging-mock-asset",
            assetId: "hug9i01Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav3mg",
          },
        ],
        duration: 5.055667,
        createdAt: 1736864397,
        mp4Support: "standard",
        passthrough: "VIDE-ZHHRL-29844",
        muxAssetId: "hug9i01Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav3mg",
        playbackIds: [
          {
            id: "mVkKUtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeA",
            policy: "signed",
          },
          {
            id: "BW00NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF00",
            policy: "public",
          },
        ],
        encodingTier: "smart",
        videoQuality: "plus",
        muxPlaybackId: "BW00NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF00",
        signedStreamId: "mVkKUtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeA",
        staticRenditions: {
          status: "preparing",
        },
        maxResolutionTier: "1080p",
        maxStoredResolution: "Audio only",
        nonStandardInputReasons: {
          audioCodec: "mp3",
        },
      },
    },
  ],
  cycle4: [
    {
      order: "1",
      mediaId: "8765432",
      customTitle: "Cycle4 Video 1",
      mediaObject: {
        id: "9ab7d60775b95bbc722d4d259fb033cd",
        url: "http://example.com/video2.mp4",
        type: "upload",
        bytes: 120345,
        width: 1920,
        format: "mp4",
        height: 1080,
        version: 1736860391,
        duration: 10.245789,
        metadata: {
          assetType: "video_instructional",
          sourceType: "partner_created",
          assetSource: "partner_created",
          licenceType: "standard",
          contentCycle: "cycle_3",
          permissionGranted: "required",
        },
        secureUrl: "https://example.com/video2.mp4",
        accessMode: "private",
        assetFolder:
          "Cycle 4 assets/MFL - Spanish - Secondary/Video/Y8/ES8U20/ES8U20L2",
        displayName: "Task_Video_2",
        resourceType: "video",
      },
      mediaType: "video",
      videoId: 44,
      videoObject: {
        id: "abc901Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav3xy",
        status: "ready",
        tracks: [
          {
            id: "54v67aMKIr5Z014b3n3AVwNHjAPnWSuhJCm008E026lZZX",
            type: "video",
            duration: 10.245789,
          },
          {
            id: "staging-mock-asset-2",
            assetId: "abc901Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav3xy",
          },
        ],
        duration: 10.245789,
        createdAt: 1736865599,
        mp4Support: "standard",
        passthrough: "VIDE-ZHHRL-39999",
        muxAssetId: "abc901Tnpf1y83irOm00HRbvAJpttJPU78KNYz305or",
        playbackIds: [
          {
            id: "nLK1UtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeB",
            policy: "signed",
          },
          {
            id: "CC11NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF11",
            policy: "public",
          },
        ],
        encodingTier: "premium",
        videoQuality: "high",
        muxPlaybackId: "CC11NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF11",
        signedStreamId: "nLK1UtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeB",
        staticRenditions: {
          status: "ready",
        },
        maxResolutionTier: "4K",
        maxStoredResolution: "1080p",
        nonStandardInputReasons: {
          audioCodec: "h264",
        },
      },
    },
  ],
};

export default lessonMediaClipsFixtures;
