import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";
import Svg from "../Svg";
import { SvgName } from "../SpriteSheet/getSvgId";

import Card, { CardProps } from "./Card";

export type SubjectCardLinkProps = Omit<CardProps, "children"> & {
  title: string;
  titleTag?: HeadingTag;
  slug: string;
  unitCount: number;
  keyStageSlug: string;
  lessonCount?: number;
  svgName?: SvgName;
  imageBackground?: OakColorName;
  background?: OakColorName;
  available?: boolean;
};

const SubjectCardLink: FC<SubjectCardLinkProps> = ({
  title,
  slug,
  titleTag = "h3",
  keyStageSlug,
  lessonCount = 123,
  unitCount,
  imageBackground,
  background = "teachersPastelYellow",
  svgName = "SubjectArtAndDesign",
  available = true,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  return (
    <Card
      {...(available && { ...containerProps })}
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={"white"}
      $pa={[0, 0]}
      $mb={[16, 0]}
    >
      <Flex
        $background={available ? imageBackground : background}
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
        $background={background}
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
        {available ? (
          <>
            <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
              <OakLink
                {...primaryTargetProps}
                page={"unit-index"}
                keyStage={keyStageSlug}
                subject={slug}
              >
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

export default SubjectCardLink;
