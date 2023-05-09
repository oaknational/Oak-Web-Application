import { FC } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";
import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";
import Card, { CardProps } from "../Card";
import SubjectIcon from "../SubjectIcon";
import { ProgrammesBySubject } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";

export type SubjectCardListItemProps = Omit<CardProps, "children"> & {
  titleTag?: HeadingTag;
} & {
  programmes: ProgrammesBySubject;
  isAvailable: boolean;
};

const SubjectCardListItem: FC<SubjectCardListItemProps> = ({
  titleTag = "h3",
  programmes,
  isAvailable,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  const firstProgramme = programmes[0];

  const {
    subjectSlug,
    subjectTitle,
    keyStageSlug,
    programmeSlug,
    keyStageTitle,
  } = firstProgramme;
  const totalUnitCount = programmes.reduce((acc, cur) => {
    return acc + (cur.totalUnitCount || 0);
  }, 0);
  const activeLessonCount = programmes.reduce((acc, cur) => {
    return acc + (cur.activeLessonCount || 0);
  }, 0);

  const backgroundColor = isAvailable ? "teachersPastelYellow" : "white";

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

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
        <SubjectIcon
          subjectSlug={subjectSlug}
          height={96}
          width={96}
          $width={96}
          $ma={"auto"}
          $transform={isHovered ? "scale(1)" : "scale(0.8)"}
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
              {programmes.length === 1 ? (
                <OakLink
                  {...primaryTargetProps}
                  page="unit-index"
                  programme={programmeSlug}
                  //TODO add tracking
                >
                  {subjectTitle}
                </OakLink>
              ) : (
                <OakLink
                  {...primaryTargetProps}
                  page="programme-index"
                  keyStage={keyStageSlug}
                  subject={subjectSlug}
                  //TODO: replace 'key stage 4' with variable from above
                  onClick={() => {
                    track.subjectSelected({
                      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                      keyStageSlug,
                      subjectTitle: subjectTitle,
                      subjectSlug: subjectSlug,
                      analyticsUseCase,
                    });
                  }}
                >
                  {subjectTitle}
                </OakLink>
              )}
            </Heading>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${totalUnitCount} units`}</Typography>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${activeLessonCount} lessons`}</Typography>
          </>
        ) : (
          <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
            {subjectTitle}
          </Heading>
        )}
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectCardListItem;
