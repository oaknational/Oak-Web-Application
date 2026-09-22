import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakVideo,
} from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";

import { Video } from "@/common-lib/cms-types";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

export function CampaignVideoBanner({
  textStyles,
  video,
  heading,
  subheading,
}: Readonly<{
  heading: PortableTextBlock[];
  video: Video;
  subheading?: PortableTextBlock[] | null;
  textStyles?: PortableTextComponents;
}>) {
  return (
    <OakGrid
      $mt={["spacing-72", "spacing-72", "spacing-80"]}
      $maxWidth={["unset", "spacing-1280"]}
    >
      <OakGridArea
        $colSpan={[12, 5, 5]}
        $colStart={[1, 2, 2]}
        $rowStart={0}
        $mb={["spacing-24", "spacing-48"]}
      >
        {video && (
          <OakVideo
            videoSlot={
              <VideoPlayer
                playbackPolicy="public"
                thumbnailTime={video.video.asset.thumbTime}
                playbackId={video.video.asset.playbackId}
                title={video.title}
                location="marketing"
                omitBorder={true}
              />
            }
            showTranscript={true}
            transcript={video.transcript}
          />
        )}
      </OakGridArea>
      <OakGridArea
        $colSpan={[12, 4, 4]}
        $colStart={[0, 8, 8]}
        $rowStart={0}
        $mb={["spacing-24", "spacing-48"]}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
        <OakBox>
          {subheading && <PortableTextWithDefaults value={subheading} />}
        </OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
