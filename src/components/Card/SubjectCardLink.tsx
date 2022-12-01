import { FC, MutableRefObject } from "react";

import { OakColorName } from "../../styles/theme";
import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";
import Svg from "../Svg";
import { SvgName } from "../SpriteSheet/getSvgId";

import Card, { CardProps } from "./Card";

type TitleProps = {
  subjectTitle: string;
  titleTag: HeadingTag;
};

export type SubjectCardLinkProps = Omit<CardProps, "children"> & {
  totalLessons: number;
  totalUnits: number;
  svgName: SvgName;
  imageBackground?: OakColorName;
  background: OakColorName;
  available: boolean;
  keyStageSlug: string;
  subjectSlug: string;
} & TitleProps;

type SummaryAvailableProps = Pick<
  SubjectCardLinkProps,
  "keyStageSlug" | "subjectSlug" | "totalLessons" | "totalUnits"
> &
  TitleProps & {
    primaryTargetProps: { ref: MutableRefObject<HTMLAnchorElement | null> };
  };

const SummaryAvailable: FC<SummaryAvailableProps> = ({
  keyStageSlug,
  subjectSlug,
  titleTag,
  subjectTitle,
  totalUnits,
  totalLessons,
  primaryTargetProps,
}) => {
  return (
    <>
      <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
        <OakLink
          {...primaryTargetProps}
          page={"unit-index"}
          keyStage={keyStageSlug}
          subject={subjectSlug}
        >
          {subjectTitle}
        </OakLink>
      </Heading>
      <Typography
        $font={"body-2"}
        $color={"grey4"}
      >{`${totalUnits} units`}</Typography>
      <Typography
        $font={"body-2"}
        $color={"grey4"}
      >{`${totalLessons} lessons`}</Typography>
    </>
  );
};

const SummaryUnavailable: FC<TitleProps> = ({ titleTag, subjectTitle }) => {
  return (
    <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
      {subjectTitle}
    </Heading>
  );
};

const SubjectCardLink: FC<SubjectCardLinkProps> = ({
  subjectTitle,
  titleTag,
  totalLessons,
  totalUnits,
  imageBackground,
  background,
  svgName,
  available,
  keyStageSlug,
  subjectSlug,
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
          <SummaryAvailable
            subjectTitle={subjectTitle}
            subjectSlug={subjectSlug}
            titleTag={titleTag}
            keyStageSlug={keyStageSlug}
            totalLessons={totalLessons}
            totalUnits={totalUnits}
            primaryTargetProps={primaryTargetProps}
          />
        ) : (
          <SummaryUnavailable subjectTitle={subjectTitle} titleTag={titleTag} />
        )}
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectCardLink;
