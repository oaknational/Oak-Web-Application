import { PortableTextComponents } from "@portabletext/react";
import { FC } from "react";
import { OakLI } from "@oaknational/oak-components";

import { LandingPageOlOutline } from "@/components/GenericPagesComponents/LandingPageOlOutline";
import { TextAndMedia } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Card from "@/components/SharedComponents/Card";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import Flex from "@/components/SharedComponents/Flex";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const landingPortableTextComponent: PortableTextComponents = {
  list: {
    number: ({ children }) => (
      <LandingPageOlOutline $color={"lemon50"} $mh={"space-between-none"}>
        {children}
      </LandingPageOlOutline>
    ),
  },

  listItem: {
    number: (props) => {
      const listItemText = props?.value?.children[0]?.text;

      return (
        <Flex $position={"relative"} $mb={48} $alignItems={"center"}>
          <OakLI $font={["heading-7", "heading-6"]}>{listItemText}</OakLI>
        </Flex>
      );
    },
  },
};

export const LandingPageTextAndMedia: FC<TextAndMedia> = (props) => {
  return (
    <Card
      $flexDirection={["column", "row"]}
      $background={"lemon50"}
      $width={"100%"}
      $mb={[56, 92]}
      $pb={24}
      $ph={[16, 56]}
    >
      <BrushBorders hideOnMobileH color={"lemon50"} />

      <Flex
        $minHeight={200}
        $position="relative"
        $minWidth={["100%", "50%"]}
        $mb={[40, 0]}
      >
        {props.mediaType == "image" && (
          <CMSImage
            $pr={[0, 24, 72]}
            alt={props.image.altText || ""}
            $objectFit="contain"
            $objectPosition={"center"}
            fill
            priority
            image={props.image}
          />
        )}
        {props.mediaType == "video" && (
          <Flex $alignItems={"center"} $ph={20}>
            <CMSVideo video={props.video} location="marketing" />
          </Flex>
        )}
      </Flex>
      <Flex
        $minWidth={["100%", "50%"]}
        $justifyContent={"center"}
        $flexDirection={"column"}
      >
        <PortableTextWithDefaults
          components={landingPortableTextComponent}
          value={props.bodyPortableText}
        />

        <div>
          {props.cta && (
            <ButtonAsLink
              icon="arrow-right"
              $iconPosition={"trailing"}
              $mt={[48, 32]}
              label={props.cta.label}
              page={null}
              href={getLinkHref(props.cta)}
            />
          )}
        </div>
      </Flex>
    </Card>
  );
};
