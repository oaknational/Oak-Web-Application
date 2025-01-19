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
import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

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
    learningCycleVideos: MediaClipListCamelCase;
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
    lessonOutline: { lessonOutline: string }[] | null;
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
          customTitle: "Intro Video 1",
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
          order: "2",
          mediaId: "8765432",
          customTitle: "Outro Video 1",
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
              "Cycle 3 assets/MFL - Spanish - Secondary/Video/Y8/ES8U20/ES8U20L2",
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
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};

export const MoreThan4Cycles: Story = {
  args: {
    learningCycleVideos: {
      intro: [
        {
          order: "3",
          mediaId: "9823456",
          customTitle: "Tutorial Clip",
          mediaObject: {
            id: "7cd3f60775b95bbc722d4d259fb033ef",
            url: "http://example.com/tutorial.mp4",
            type: "upload",
            bytes: 230540,
            width: 1280,
            format: "mp4",
            height: 720,
            version: 1736860492,
            duration: 15.523789,
            metadata: {
              assetType: "video_tutorial",
              sourceType: "user_created",
              assetSource: "user_uploaded",
              licenceType: "creative_commons",
              contentCycle: "cycle_1",
              permissionGranted: "granted",
            },
            secureUrl: "https://example.com/tutorial.mp4",
            accessMode: "public",
            assetFolder:
              "Cycle 1 assets/MFL - German - Secondary/Video/Y9/DE9U10/DE9U10L4",
            displayName: "Tutorial_Step_4",
            resourceType: "video",
          },
          mediaType: "video",
          videoId: 55,
          videoObject: {
            id: "xyz001Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav4kl",
            status: "processing",
            tracks: [
              {
                id: "98v67aMKIr5Z014b3n3AVwNHjAPnWSuhJCm008E026lYYX",
                type: "video",
                duration: 15.523789,
              },
              {
                id: "staging-tutorial-asset",
                assetId: "xyz001Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav4kl",
              },
            ],
            duration: 15.523789,
            createdAt: 1736866700,
            mp4Support: "enhanced",
            passthrough: "TUTORIAL-ZHHRL-56789",
            muxAssetId: "xyz001Tnpf1y83irOm00HRbvAJpttJPU78KNYzPav4kl",
            playbackIds: [
              {
                id: "rOP9UtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeC",
                policy: "signed",
              },
              {
                id: "DD12NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF22",
                policy: "public",
              },
            ],
            encodingTier: "ultra",
            videoQuality: "premium",
            muxPlaybackId: "DD12NkK9R01jB8PPO7R00YCFl2XBDn13GTkhd0001PNtheF22",
            signedStreamId: "rOP9UtOfoD1100012GNC1pCO6RvUgyGwqGoq01pYsy7WeC",
            staticRenditions: {
              status: "ready",
            },
            maxResolutionTier: "1440p",
            maxStoredResolution: "720p",
            nonStandardInputReasons: {
              audioCodec: "aac",
            },
          },
        },
      ],
      cycle1: [
        {
          order: "1",
          mediaId: "192200",
          videoId: 39901,
          mediaType: "video",
          customTitle: "Intro Video A",
          mediaObject: {
            id: "abc1234xyz5678mnop9123qrst4567",
            url: "http://example.com/videoA.mp3",
            type: "upload",
            bytes: 65432,
            width: 0,
            format: "mp3",
            height: 0,
            version: 1736862001,
            duration: 6.342733,
            metadata: {
              assetType: "audio_speech",
              sourceType: "partner_created",
              assetSource: "partner_created",
              licenceType: "standard",
              contentCycle: "cycle_3",
              permissionGranted: "required",
            },
            secureUrl: "https://example.com/videoA.mp3",
            accessMode: "public",
            assetFolder:
              "Cycle 3 assets/MFL - Spanish - Secondary/Audio/Y8/ES8U12/ES8U12L2",
            displayName: "12_task_C2_5",
            resourceType: "video",
          },
          videoObject: {
            id: "nkl123jkd456poi789qwe102zxc304",
            status: "processing",
            tracks: [
              {
                id: "trk123abc456def789ghi000jkl999",
                type: "audio",
                duration: 6.342733,
              },
              {
                id: "staging-mock-asset",
                assetId: "nkl123jkd456poi789qwe102zxc304",
              },
            ],
            duration: 6.35,
            createdAt: 1736865400,
            mp4Support: "premium",
            passthrough: "VIDE-XZXZX-39901",
            muxAssetId: "nkl123jkd456poi789qwe102zxc304",
            playbackIds: [
              {
                id: "abc000xyz001rst002uvw003efg004",
                policy: "signed",
              },
              {
                id: "rst789uvw890efg901hij902klm903",
                policy: "public",
              },
            ],
            encodingTier: "pro",
            videoQuality: "ultra",
            muxPlaybackId: "rst789uvw890efg901hij902klm903",
            signedStreamId: "abc000xyz001rst002uvw003efg004",
            staticRenditions: {
              status: "preparing",
            },
            maxResolutionTier: "4K",
            maxStoredResolution: "Audio only",
            nonStandardInputReasons: {
              audioCodec: "aac",
            },
          },
        },
        {
          order: "2",
          mediaId: "192201",
          videoId: 39902,
          mediaType: "video",
          customTitle: "§§ Video B",
          mediaObject: {
            id: "def456uvw890ghi321jkl654mno789",
            url: "http://example.com/videoB.mp3",
            type: "upload",
            bytes: 123456,
            width: 0,
            format: "mp3",
            height: 0,
            version: 1736862012,
            duration: 8.123456,
            metadata: {
              assetType: "audio_speech",
              sourceType: "partner_created",
              assetSource: "partner_created",
              licenceType: "premium",
              contentCycle: "cycle_4",
              permissionGranted: "notRequired",
            },
            secureUrl: "https://example.com/videoB.mp3",
            accessMode: "private",
            assetFolder:
              "Cycle 4 assets/MFL - German - Secondary/Audio/Y9/DE9U21/DE9U21L3",
            displayName: "15_task_C4_7",
            resourceType: "video",
          },
          videoObject: {
            id: "xyz789rst654uvw123abc456qwe789",
            status: "ready",
            tracks: [
              {
                id: "def890ghi123jkl456mno789pqr012",
                type: "audio",
                duration: 8.123456,
              },
              {
                id: "staging-mock-asset",
                assetId: "xyz789rst654uvw123abc456qwe789",
              },
            ],
            duration: 8.13,
            createdAt: 1736865405,
            mp4Support: "basic",
            passthrough: "VIDE-YXYXY-39902",
            muxAssetId: "xyz789rst654uvw123abc456qwe789",
            playbackIds: [
              {
                id: "klm456nop789qrs000tuv123wxy345",
                policy: "public",
              },
              {
                id: "nop890qrs001tuv456wxy789zab012",
                policy: "signed",
              },
            ],
            encodingTier: "smart",
            videoQuality: "plus",
            muxPlaybackId: "klm456nop789qrs000tuv123wxy345",
            signedStreamId: "nop890qrs001tuv456wxy789zab012",
            staticRenditions: {
              status: "completed",
            },
            maxResolutionTier: "1080p",
            maxStoredResolution: "720p",
            nonStandardInputReasons: {
              audioCodec: "ogg",
            },
          },
        },
      ],
      cycle_4: [
        {
          order: "1",
          mediaId: "193300",
          videoId: 50001,
          mediaType: "video",
          customTitle: "Intro Video X",
          mediaObject: {
            id: "ghj789lmn123opq456rst789uvw000",
            url: "http://example.com/videoX.mp3",
            type: "upload",
            bytes: 73456,
            width: 0,
            format: "mp3",
            height: 0,
            version: 1736873001,
            duration: 4.875,
            metadata: {
              assetType: "audio_speech",
              sourceType: "external_upload",
              assetSource: "external",
              licenceType: "creative_commons",
              contentCycle: "cycle_5",
              permissionGranted: "required",
            },
            secureUrl: "https://example.com/videoX.mp3",
            accessMode: "public",
            assetFolder:
              "Cycle 5 assets/MFL - Italian - Secondary/Audio/Y10/IT10U10/IT10U10L5",
            displayName: "Intro_Audio_X",
            resourceType: "audio",
          },
          videoObject: {
            id: "ijk456mno123pqr789stu345vwx678",
            status: "ready",
            tracks: [
              {
                id: "xyz000rst111uvw222opq333lmn444",
                type: "audio",
                duration: 4.875,
              },
              {
                id: "staging-mock-asset",
                assetId: "ijk456mno123pqr789stu345vwx678",
              },
            ],
            duration: 4.882,
            createdAt: 1736874000,
            mp4Support: "standard",
            passthrough: "VIDE-ABCDE-50001",
            muxAssetId: "ijk456mno123pqr789stu345vwx678",
            playbackIds: [
              {
                id: "rst123uvw456opq789xyz000abc123",
                policy: "public",
              },
              {
                id: "uvw789xyz000abc123rst456opq789",
                policy: "signed",
              },
            ],
            encodingTier: "basic",
            videoQuality: "standard",
            muxPlaybackId: "rst123uvw456opq789xyz000abc123",
            signedStreamId: "uvw789xyz000abc123rst456opq789",
            staticRenditions: {
              status: "ready",
            },
            maxResolutionTier: "720p",
            maxStoredResolution: "Audio only",
            nonStandardInputReasons: {
              audioCodec: "wav",
            },
          },
        },
      ],
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};
