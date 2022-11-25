import { FC } from "react";

import Flex from "../Flex";
import { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import Icon, { IconName } from "../Icon";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import OakLink from "../OakLink";
import Box from "../Box";

type SubjectTitleCardProps = {
  title: string;
  keyStage: string;
  keyStageSlug: string;
  iconName: IconName;
  background: OakColorName;
};

/**
 * Contains an title, icon and keystage link.
 *
 * ## Usage
 * Used on subject by keystage, tier, unit and lesson pages.
 */
const SubjectTitleCard: FC<SubjectTitleCardProps> = ({
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
            <Heading $font={"heading-7"} tag={"h2"}>
              {keyStage}
            </Heading>
          </OakLink>
        </Box>
      </Flex>
      <Flex
        $justifyContent={"center"}
        $alignItems={"center"}
        $height={[130, 160]}
        $width={["100%", 160]}
        $background={background}
      >
        <Icon size={[92, 120]} name={iconName}>
          {title}
        </Icon>
      </Flex>
    </Flex>
  );
};

SubjectTitleCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SubjectTitleCard;
