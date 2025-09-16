import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";

import { Video } from "@/common-lib/cms-types";
import CMSVideo from "@/components/SharedComponents/CMSVideo";

export function CampaignVideoBanner({
  textStyles,
  video,
  heading,
  subheading,
}: {
  heading: PortableTextBlock[];
  video: Video;
  subheading?: PortableTextBlock[] | null;
  textStyles?: PortableTextComponents;
}) {
  return (
    <OakGrid
      $mt={["space-between-xxl", "space-between-xxl", "space-between-xxxl"]}
      $maxWidth={["unset", "all-spacing-24"]}
    >
      <OakGridArea
        $colSpan={[12, 5, 5]}
        $colStart={[1, 2, 2]}
        $rowStart={0}
        $mb={["space-between-m", "space-between-l"]}
      >
        {video && <CMSVideo video={video} location="marketing" />}
      </OakGridArea>
      <OakGridArea
        $colSpan={[12, 4, 4]}
        $colStart={[0, 8, 8]}
        $rowStart={0}
        $mb={["space-between-m", "space-between-l"]}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
        <OakBox>
          {subheading && <PortableTextWithDefaults value={subheading} />}
        </OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
