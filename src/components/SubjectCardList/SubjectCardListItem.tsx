import { FC } from "react";

import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";
import Svg from "../Svg";
import { SvgName } from "../SpriteSheet/getSvgId";
import Card, { CardProps } from "../Card";
import { ResolveOakHrefProps } from "../../common-lib/urls";

export type SubjectCardListItemProps = Omit<CardProps, "children"> & {
  title: string;
  slug: string;
  keyStageSlug: string;
  unitCount: number | null;
  lessonCount: number | null;
  tierCount: number | null;
  titleTag?: HeadingTag;
  svgName?: SvgName;
};

const SubjectCardListItem: FC<SubjectCardListItemProps> = ({
  title,
  slug,
  titleTag = "h3",
  keyStageSlug,
  lessonCount,
  tierCount,
  unitCount,
  svgName = "SubjectArtAndDesign",
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const isAvailable = Boolean(lessonCount);
  const backgroundColor = isAvailable ? "teachersPastelYellow" : "white";

  const linkProps: ResolveOakHrefProps = tierCount
    ? { page: "tier-selection", keyStage: keyStageSlug, subject: slug }
    : { page: "unit-index", keyStage: keyStageSlug, subject: slug };

  return (
    <Card
      {...(isAvailable && { ...containerProps })}
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={"white"}
      $pa={[0, 0]}
      $mb={[16, 0]}
    >
      <Flex
        $background={backgroundColor}
        $position={"relative"}
        $width={"100%"}
        $pv={16}
      >
        <Svg
          name={svgName}
          $height={80}
          $width={80}
          $ma={"auto"}
          $transform={isHovered ? "scale(1.2)" : null}
        />
      </Flex>
      <Flex
        $flexDirection={"column"}
        $position={"relative"}
        $width={"100%"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $pv={8}
        $ph={8}
        $transform={isHovered ? "translateY(-8px)" : null}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.3s ease"}
        $minHeight={110}
      >
        {isAvailable ? (
          <>
            <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
              <OakLink {...primaryTargetProps} {...linkProps}>
                {title}
              </OakLink>
            </Heading>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${unitCount} units`}</Typography>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${lessonCount} lessons`}</Typography>
          </>
        ) : (
          <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
            {title}
          </Heading>
        )}
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectCardListItem;
