import { FC } from "react";
import { OakHeading } from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";

export const titleCardIconBackground = {
  subject: "lemon50",
  unit: "lavender50",
  lesson: "pink",
  lessons: "lavender50",
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
          <OakHeading
            $mb={"space-between-ssx"}
            $font={["heading-5", "heading-4"]}
            tag={"h1"}
          >
            {title}
          </OakHeading>
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
