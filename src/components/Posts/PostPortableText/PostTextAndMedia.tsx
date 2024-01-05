import type { PortableTextComponentProps } from "@portabletext/react";

import { PortableTextJSON, TextAndMedia } from "@/common-lib/cms-types";
import { OmitKeepDiscriminated } from "@/utils/generics";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import Box from "@/components/SharedComponents/Box";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import CMSImage from "@/components/CMSImage";
import Flex from "@/components/SharedComponents/Flex";
import { Heading } from "@/components/Typography";
import VideoPlayer from "@/components/VideoPlayer";
import { PortableTextWithDefaults } from "@/components/PortableText";

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
    <Flex $flexDirection={flexDirection} $alignItems={"center"} $mt={56}>
      <div>
        <Heading $font={["heading-5", "heading-4"]} tag="h2">
          {params.title}
        </Heading>
        <Box $mt={32}>
          <PortableTextWithDefaults value={params.body} />
        </Box>
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
        <Box $mr={24}>
          <CMSImage image={params.image} />
        </Box>
      )}
      {params.mediaType === "video" && params.video && (
        <Box $mr={24}>
          <VideoPlayer
            title={params.video.title}
            playbackId={params.video.video.asset.playbackId}
            location="blog"
            playbackPolicy="public"
            isLegacy={true}
          />
        </Box>
      )}
    </Flex>
  );
};

export default PostTextAndMedia;
