import { PortableTextComponents } from "@portabletext/react";
import { FC } from "react";

import { TextBlock } from "@/common-lib/cms-types";
import { OakColorName } from "@/styles/theme";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Card from "@/components/SharedComponents/Card";
import CardImage, {
  CardImageProps,
} from "@/components/SharedComponents/Card/CardComponents/CardImage";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "@/components/Typography";
import { PortableTextWithDefaults } from "@/components/PortableText";

const TextBlockCardImageCta: FC<
  TextBlock & {
    background: OakColorName;
    image: CardImageProps;
    portableTextComponents?: PortableTextComponents;
    imageContainerProps?: FlexProps;
  }
> = ({
  bodyPortableText,
  image,
  title,
  background,
  cta,
  imageContainerProps,
}) => {
  return (
    <Card
      $flexDirection={["column", "column", "row"]}
      $mb={56}
      $background={background}
      $ph={[16, 32]}
      $pv={32}
      $alignItems={["center"]}
    >
      <Flex
        $minWidth={360}
        $maxWidth={[null, 360, null]}
        $alignItems="center"
        $mr={[0, 0, 72]}
        $mb={[12, 12, 0]}
        $ph={[16, 0]}
        {...imageContainerProps}
      >
        <CardImage {...image} />
      </Flex>
      <Flex $flexDirection={"column"} $font={["body-2", "body-1"]}>
        <Heading $mb={32} $font={["heading-5", "heading-4"]} tag={"h2"}>
          {title}
        </Heading>
        <PortableTextWithDefaults
          value={bodyPortableText}
          withoutDefaultComponents
        />
        {cta && (
          <Flex>
            <ButtonAsLink
              $mt={32}
              href={getLinkHref(cta)}
              page={null}
              label={cta.label}
              icon={"arrow-right"}
              $iconPosition={"trailing"}
              htmlAnchorProps={{ target: "_self" }}
              // @TODO: This link is dynamic, not always a support link
              // so we may not always want to open it in a new tab
              // See owa issue #619
              // When this is standardized remove the exclusions from sonar
            />
          </Flex>
        )}
      </Flex>
      <BrushBorders hideOnMobileH color={background} />
    </Card>
  );
};

export default TextBlockCardImageCta;
