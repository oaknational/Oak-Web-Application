import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
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

export type TitlePageType =
  | {
      page: "unit" | "subject";
      keyStage: string;
      keyStageSlug: string;
    }
  | {
      page: "lesson";
      keyStage: string;
      keyStageSlug: string;
      subject: string;
      subjectSlug: string;
    };

type TitleCardProps = FlexProps & {
  title: string;
  iconName: IconName;
} & TitlePageType;

/**
 * Contains an title, icon and keystage link.
 *
 * ## Usage
 * Used on subject by keystage, tier, unit and lesson pages.
 */
const TitleCard: FC<TitleCardProps> = (props) => {
  const { title, keyStage, keyStageSlug, iconName, page, ...flexProps } = props;
  return (
    <Flex $width={["100%", "auto"]} $position={"relative"} {...flexProps}>
      <Flex
        $width={["100%", "auto"]}
        $display={"inline-flex"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $alignItems={"center"}
      >
        <Box $mh={24}>
          <Heading $mb={8} $font={["heading-5", "heading-4"]} tag={"h1"}>
            {title}
          </Heading>
          <OakLink slug={keyStageSlug} page={"subject-index"}>
            <Span $font={"heading-7"}>{keyStage}</Span>
          </OakLink>
          {page === "lesson" && (
            // @todo Change to subject when pages are created
            <OakLink $ml={16} slug={props.subjectSlug} page={"subject-index"}>
              <Span $font={"heading-7"}>{props.subject}</Span>
            </OakLink>
          )}
          {page === "lesson" && (
            // @todo Change to subject when pages are created
            <OakLink $ml={16} slug={props.subjectSlug} page={"key-stage"}>
              <Span $font={"heading-7"}>{props.subject}</Span>
            </OakLink>
          )}
        </Box>
        <Flex
          $justifyContent={"center"}
          $alignItems={"center"}
          $minHeight={[96, 160]}
          $width={[72, 160]}
          $background={titleCardIconBackground[page]}
        >
          <Icon size={[44, 120]} name={iconName} />
        </Flex>
      </Flex>
      <BoxBorders gapPosition="bottomRight" />
    </Flex>
  );
};

export default TitleCard;
