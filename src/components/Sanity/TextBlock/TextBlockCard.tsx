import { PortableText, PortableTextComponents } from "@portabletext/react";
import { FC } from "react";

import { TextBlock } from "../../../common-lib/cms-types";
import { OakColorName } from "../../../styles/theme";
import Card from "../../Card";
import { ULTick } from "../../PortableText/Blocks/Lists/ULTick";
import BrushBorders from "../../SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading } from "../../Typography";

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
      <Heading $mb={32} tag="h2" $font={["heading-4", "heading-5"]}>
        {title}
      </Heading>
      <PortableText
        components={{ ...textBlockCardPortableText, ...portableTextComponents }}
        value={bodyPortableText}
      />
      <BrushBorders hideOnMobileH color={background} />
    </Card>
  );
};
