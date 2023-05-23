import { PortableText, PortableTextComponents } from "@portabletext/react";
import { FC } from "react";

import { TextAndMedia } from "../../../common-lib/cms-types";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Card from "../../Card";
import CMSImage from "../../CMSImage";
import CMSVideo from "../../CMSVideo";
import Flex from "../../Flex";
import BrushBorders from "../../SpriteSheet/BrushSvgs/BrushBorders";
import { LI } from "../../Typography";

import { OLOutline } from "./OLOutline";

const landingPortableTextComponent: PortableTextComponents = {
  list: {
    number: ({ children }) => (
      <OLOutline $color={"teachersPastelYellow"} $mh={0}>
        {children}
      </OLOutline>
    ),
  },

  listItem: {
    number: (props) => {
      const listItemText = props?.value?.children[0]?.text;

      return (
        <Flex $position={"relative"} $mb={48} $alignItems={"center"}>
          <LI $font={["heading-7", "heading-6"]}>{listItemText}</LI>
        </Flex>
      );
    },
  },
};

export const LandingPageTextAndMedia: FC<TextAndMedia> = (props) => {
  return (
    <Card
      $flexDirection={["column", "row"]}
      $background={"teachersPastelYellow"}
      $width={"100%"}
      $mb={[56, 92]}
      $pb={24}
      $ph={[16, 56]}
    >
      <BrushBorders hideOnMobileH color={"teachersPastelYellow"} />

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
        <PortableText
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
              href={getCTAHref(props.cta)}
            />
          )}
        </div>
      </Flex>
    </Card>
  );
};
