import { FC } from "react";
import { PortableText } from "@portabletext/react";

import { PortableTextJSON } from "../../common-lib/cms-types";
import Flex, { FlexProps } from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import Cover from "../Cover";
import OakImage from "../OakImage/OakImage";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";

import Card from "./Card";
import { IconName } from "../Icon";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

type ImageProps = {
  src: string;
  alt: string;
};

type SubjectHeadingCardProps = {
  title: string;
  keyStage: string;
  iconName: IconName;
  background: OakColorName;
};

/**
 * Contains an heading, title, and optional image.
 * image disapears on mobile
 * Optional imageContainerProps for image size variants
 *
 * ## Usage
 * Summary card heading used at the top of page
 */
const SubjectHeadingCard: FC<SubjectHeadingCardProps> = ({
  title,
  keyStage,
  iconName,
  background,
}) => {
  return (
    <Flex
      $pa={0}
      $flexDirection={"row"}
      $justifyContent={"space-between"}
      $width={[420, "100%"]}
      $pv={[24]}
      $ph={[16, 24]}
    >
      <Flex $background={background}>
        <Heading tag={"h1"} />
      </Flex>
    </Flex>
  );
};

SubjectHeadingCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SubjectHeadingCard;
