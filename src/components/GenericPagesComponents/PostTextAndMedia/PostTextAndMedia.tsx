import type { PortableTextComponentProps } from "@portabletext/react";
import { OakHeading, OakFlex, OakBox } from "@oaknational/oak-components";

import { PortableTextJSON, TextAndMedia } from "@/common-lib/cms-types";
import { OmitKeepDiscriminated } from "@/utils/generics";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import CMSImage from "@/components/SharedComponents/CMSImage";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

// When we get the JSON portable text it doesn't have the same field names as
// our generic types / what comes from our graphql queries
type TextAndMediaBlock = OmitKeepDiscriminated<
  TextAndMedia,
  "bodyPortableText"
> & {
  body: PortableTextJSON;
};

const PostTextAndMedia = (
  props: PortableTextComponentProps<TextAndMediaBlock>,
) => {
  if (!props.value) {
    return null;
  }

  const params = props.value;

  // @TODO: Responsive handling - likely don't want it reversed
  const flexDirection = params.alignMedia === "left" ? "row-reverse" : "row";

  return (
    <OakFlex
      $flexDirection={flexDirection}
      $alignItems={"center"}
      $mt="space-between-xl"
    >
      <div>
        <OakHeading $font={["heading-5", "heading-4"]} tag="h2">
          {params.title}
        </OakHeading>
        <OakBox $mt="space-between-m2">
          <PortableTextWithDefaults value={params.body} />
        </OakBox>
        {params.cta && (
          <ButtonAsLink
            $mt={24}
            label={params.cta.label}
            page={null}
            href={getLinkHref(params.cta)}
            background={"blue"}
          />
        )}
      </div>
      {params.mediaType === "image" && params.image && (
        <OakBox $mr="space-between-m">
          <CMSImage image={params.image} />
        </OakBox>
      )}
      {params.mediaType === "video" && params.video && (
        <OakBox $mr="space-between-m">
          <VideoPlayer
            title={params.video.title}
            playbackId={params.video.video.asset.playbackId}
            location="blog"
            playbackPolicy="public"
            isLegacy={true}
          />
        </OakBox>
      )}
    </OakFlex>
  );
};

export default PostTextAndMedia;
