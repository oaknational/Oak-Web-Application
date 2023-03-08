import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
import { Heading } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Box from "../Box";
import SubjectIcon from "../SubjectIcon";

export const titleCardIconBackground = {
  subject: "teachersPastelYellow",
  unit: "teachersLilac",
  lesson: "pupilsPink",
  lessons: "teachersLilac",
} as const;

export type TitlePageType =
  | {
      page: "subject";
      keyStage: string;
      keyStageSlug: string;
      slug: string;
    }
  | {
      page: "unit" | "lessons" | "lesson";
      keyStage: string;
      keyStageSlug: string;
      subject: string;
      subjectSlug: string;
    };

type TitleCardProps = FlexProps & {
  title: string;
} & TitlePageType;

/**
 * Contains an title, icon and keystage link.
 *
 * ## Usage
 * Used on subject by keystage, tier, unit and lesson pages.
 */
const TitleCard: FC<TitleCardProps> = (props) => {
  const { title, keyStage, keyStageSlug, page, ...flexProps } = props;
  const subjectSlug = page === "subject" ? props.slug : props.subjectSlug;

  return (
    <Flex $width={["100%", "auto"]} $position={"relative"} {...flexProps}>
      <Flex
        $width={["100%", "auto"]}
        $display={"inline-flex"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $alignItems={"center"}
      >
        <Box $ma={24} $maxWidth={["100%", 740, 740]}>
          <Heading $mb={8} $font={["heading-5", "heading-4"]} tag={"h1"}>
            {title}
          </Heading>
        </Box>
        <Flex
          $justifyContent={"center"}
          $alignItems={"center"}
          $minHeight={[96, 160]}
          $width={[72, 160]}
          $height={"100%"}
          $background={titleCardIconBackground[page]}
        >
          <SubjectIcon
            subjectSlug={subjectSlug}
            height={96}
            width={96}
            $width={[72, 96]}
            $minWidth={72}
            $ma={"auto"}
          />
        </Flex>
      </Flex>
      <BoxBorders gapPosition="bottomRight" />
    </Flex>
  );
};

export default TitleCard;
