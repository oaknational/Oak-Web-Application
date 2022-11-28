import { FC } from "react";

import { OakColorName } from "../../styles/theme";
import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import OakImage from "../OakImage";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";

import Card, { CardProps } from "./Card";

type RemoveField<Type, Key extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, Key>]: Type[Property];
};

type ImageProps = {
  src: string;
  alt: string;
};

type TitleProps = {
  subjectTitle: string;
  titleTag: HeadingTag;
};

type SubjectCardLinkProps = RemoveField<CardProps, "children"> & {
  lessons: number;
  units: number;
  imageProps: ImageProps;
  imageBackground?: OakColorName;
  background: OakColorName;
  available: boolean;
  // hasTiers: boolean;
  keyStageSlug: string;
  subjectSlug: string;
} & TitleProps;

type SummaryAvailableProps = Pick<
  SubjectCardLinkProps,
  "keyStageSlug" | "subjectSlug" | "lessons" | "units"
> &
  TitleProps;

const SummaryAvailable: FC<SummaryAvailableProps> = ({
  keyStageSlug,
  subjectSlug,
  titleTag,
  subjectTitle,
  units,
  lessons,
}) => {
  const { primaryTargetProps } = useClickableCard<HTMLAnchorElement>();
  return (
    <>
      <Heading $font={["heading-7"]} tag={titleTag}>
        <OakLink
          {...primaryTargetProps}
          page={"unit-index"}
          keyStage={keyStageSlug}
          subject={subjectSlug}
        >
          {subjectTitle}
        </OakLink>
      </Heading>
      <Typography $font={"body-2"}>{`${units} units`}</Typography>
      <Typography $font={"body-2"}>{`${lessons} lessons`}</Typography>
    </>
  );
};

const SummaryUnavailable: FC<TitleProps> = ({ titleTag, subjectTitle }) => {
  return (
    <Heading $font={["heading-7"]} tag={titleTag}>
      {subjectTitle}
    </Heading>
  );
};

const SubjectCardLink: FC<SubjectCardLinkProps> = ({
  subjectTitle,
  titleTag,
  lessons,
  units,
  imageBackground,
  background,
  imageProps,
  available,
  // hasTiers,
  keyStageSlug,
  subjectSlug,
}) => {
  const { containerProps, isHovered } = useClickableCard<HTMLAnchorElement>();
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
        <OakImage
          aria-hidden={true}
          alt={imageProps.alt}
          src={imageProps.src}
          height={80}
          width={80}
          $ma={"auto"}
          priority
          $transform={isHovered ? "scale(1.2)" : null}
          $transition={"transform 0.4s ease-out"}
        />
      </Flex>
      <Flex
        $background={background}
        $flexDirection={"column"}
        $position={"relative"}
        $width={"100%"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $pv={available ? 20 : 44}
        $transform={isHovered ? "translateY(-8px)" : null}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.4s ease-out"}
      >
        {available ? (
          <SummaryAvailable
            subjectTitle={subjectTitle}
            subjectSlug={subjectSlug}
            titleTag={titleTag}
            keyStageSlug={keyStageSlug}
            lessons={lessons}
            units={units}
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
