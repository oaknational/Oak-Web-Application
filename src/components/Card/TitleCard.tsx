import { FC } from "react";

import Flex from "../Flex";
import { Heading, Span } from "../Typography";
import Icon, { IconName } from "../Icon";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import OakLink from "../OakLink";
import Box from "../Box";

export const titleCardIconBackground = {
  subject: "teachersPastelYellow",
  unit: "teachersLilac",
  lesson: "pupilsPink",
} as const;

export type TitleCardIconBackground = keyof typeof titleCardIconBackground;

type TitleCardProps = {
  title: string;
  keyStage: string;
  keyStageSlug: string;
  iconName: IconName;
  background: TitleCardIconBackground;
};

/**
 * Contains an title, icon and keystage link.
 *
 * ## Usage
 * Used on subject by keystage, tier, unit and lesson pages.
 */
const TitleCard: FC<TitleCardProps> = ({
  title,
  keyStage,
  keyStageSlug,
  iconName,
  background,
}) => {
  return (
    <Flex
      $display={"inline-flex"}
      $flexDirection={["column-reverse", "row"]}
      $position={"relative"}
      $justifyContent={"space-between"}
      $width={["100%", "auto"]}
    >
      <BoxBorders gapPosition="bottomRight" />
      <Flex
        $mv={[24, 0]}
        $flexDirection={"column"}
        $justifyContent={"center"}
        $alignItems={"center"}
      >
        <Box $mh={24}>
          <Heading $font={["heading-5", "heading-4"]} tag={"h1"}>
            {title}
          </Heading>
          <OakLink slug={keyStageSlug} page={"key-stage"}>
            <Span $font={"heading-7"}>{keyStage}</Span>
          </OakLink>
        </Box>
      </Flex>
      <Flex
        $justifyContent={"center"}
        $alignItems={"center"}
        $minHeight={[130, 160]}
        $width={["100%", 160]}
        $background={titleCardIconBackground[background]}
      >
        <Icon size={[92, 120]} name={iconName} />
      </Flex>
    </Flex>
  );
};

export default TitleCard;
