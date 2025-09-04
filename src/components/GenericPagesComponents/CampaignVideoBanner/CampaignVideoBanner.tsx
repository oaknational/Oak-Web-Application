import { OakBox, OakFlex } from "@oaknational/oak-components";
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
    <OakFlex
      $maxWidth={"all-spacing-24"}
      $flexDirection={["column", "row"]}
      $justifyContent={"center"}
      $alignItems={"center"}
      $width={"100%"}
      $gap={"space-between-m"}
      $alignSelf={"stretch"}
      $borderRadius={"border-radius-xl"}
      $pv={["inner-padding-xl5"]}
      $ph={["inner-padding-xl4"]}
    >
      <OakFlex
        $flexDirection={["column", "column", "row"]}
        $justifyContent={"center"}
        $alignSelf={["auto", "unset", "stretch"]}
        $gap={["space-between-m", "space-between-m", "space-between-l"]}
        $ph={["inner-padding-m", "inner-padding-xl3"]}
      >
        <OakFlex
          $minHeight={"100%"}
          $minWidth={["100%", "100%", "fit-content"]}
          $mb={["space-between-none", "space-between-l"]}
        >
          {video && <CMSVideo video={video} location="marketing" />}
        </OakFlex>

        <OakFlex
          $alignSelf={"stretch"}
          $flexDirection={["column"]}
          $gap={"space-between-m"}
        >
          <PortableTextWithDefaults value={heading} components={textStyles} />
          <OakBox $minWidth={["fit-content"]}>
            {subheading && <PortableTextWithDefaults value={subheading} />}
          </OakBox>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
