import { Meta, StoryObj } from "@storybook/react";
import { JSX, useRef } from "react";
import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { LessonItemContainer } from "../LessonItemContainer";

import Component from "./LessonOverviewMediaClips";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { MediaClipsList } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

const LessonOverviewMediaClipsComponent = (
  args: JSX.IntrinsicAttributes & {
    learningCycleVideos: MediaClipsList;
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
    lessonOutline: { lessonOutline: string }[];
  },
) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <LessonItemContainer
          title={"Demonstration videos"}
          ref={useRef(null)}
          anchorId="media-clips"
          isSpecialist={false}
          slugs={{
            lessonSlug: "lesson-slug",
            unitSlug: "unit-slug",
            programmeSlug: "programme-slug",
          }}
          pageLinks={[
            { anchorId: "media-clips", label: "Demonstration videos" },
          ]}
          displayMediaClipButton={true}
        >
          <Component {...args} />
        </LessonItemContainer>
      </OakMaxWidth>
    </OakThemeProvider>
  );
};

export const LessonOverviewMediaClips: Story = {
  args: {
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};

export const LessThan4Cycles: Story = {
  args: {
    learningCycleVideos: {
      intro: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle1: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};

export const MoreThan4Cycles: Story = {
  args: {
    learningCycleVideos: {
      intro: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle1: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle2: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle3: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle5: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
      cycle6: [
        {
          order: "1",
          mediaId: "2321312",
          // learningCycleTitle: "Learning cycle 3",
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
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};
