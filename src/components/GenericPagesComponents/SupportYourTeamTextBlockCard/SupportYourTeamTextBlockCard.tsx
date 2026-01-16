import { PortableTextComponents } from "@portabletext/react";
import { FC } from "react";
import { OakTypography, OakHeading } from "@oaknational/oak-components";

import { TextBlock } from "@/common-lib/cms-types";
import { OakColorName } from "@/styles/theme";
import Card from "@/components/SharedComponents/Card";
import { SupportYourTeamTextBlockCardULTick } from "@/components/GenericPagesComponents/SupportYourTeamTextBlockCardULTick/SupportYourTeamTextBlockCardULTick";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const supportYourTeamTextBlockCardPortableText: PortableTextComponents = {
  ...SupportYourTeamTextBlockCardULTick,
  block: {
    normal: (props) => {
      return (
        <OakTypography $font={["body-2", "body-1"]}>
          {props.children}
        </OakTypography>
      );
    },
  },
};
/**
 * This component maps a TextBlock schema from sanity to a Card, bullet points are ticks.
 * ## Usage
 * Pass in any TextBlock sanity block, background and optional portableText components.
 */
export const SupportYourTeamTextBlockCard: FC<
  TextBlock & {
    background: OakColorName;
    portableTextComponents?: PortableTextComponents;
  }
> = (props) => {
  const { title, bodyPortableText, portableTextComponents, background } = props;
  return (
    <Card $pt={24} $ph={[16, 24]} $background={background}>
      <OakHeading
        $mb={"spacing-32"}
        tag="h2"
        $font={["heading-5", "heading-4"]}
      >
        {title}
      </OakHeading>
      <PortableTextWithDefaults
        components={{
          ...supportYourTeamTextBlockCardPortableText,
          ...portableTextComponents,
        }}
        value={bodyPortableText}
      />
      <BrushBorders hideOnMobileH color={background} />
    </Card>
  );
};
