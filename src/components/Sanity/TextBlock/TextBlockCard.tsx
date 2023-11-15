import { PortableTextComponents } from "@portabletext/react";
import { FC } from "react";

import { TextBlock } from "@/common-lib/cms-types";
import { OakColorName } from "@/styles/theme";
import Card from "@/components/Card";
import { ULTick } from "@/components/PortableText/Blocks/Lists/ULTick";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading } from "@/components/Typography";
import { PortableTextWithDefaults } from "@/components/PortableText";

const textBlockCardPortableText: PortableTextComponents = {
  ...ULTick,
  block: {
    normal: (props) => {
      return (
        <Typography $font={["body-2", "body-1"]}>{props.children}</Typography>
      );
    },
  },
};
/**
 * This component maps a TextBlock schema from sanity to a Card, bullet points are ticks.
 * ## Usage
 * Pass in any TextBlock sanity block, background and optional portableText components.
 */
export const TextBlockCard: FC<
  TextBlock & {
    background: OakColorName;
    portableTextComponents?: PortableTextComponents;
  }
> = (props) => {
  const { title, bodyPortableText, portableTextComponents, background } = props;
  return (
    <Card $pt={24} $ph={[16, 24]} $background={background}>
      <Heading $mb={32} tag="h2" $font={["heading-5", "heading-4"]}>
        {title}
      </Heading>
      <PortableTextWithDefaults
        components={{ ...textBlockCardPortableText, ...portableTextComponents }}
        value={bodyPortableText}
      />
      <BrushBorders hideOnMobileH color={background} />
    </Card>
  );
};
