import { FC } from "react";
import {
  OakTypography,
  OakHeading,
  OakHeadingTag,
  OakFlex,
} from "@oaknational/oak-components";

import { KeyStageSubject } from "./SubjectCardList";

import useAnalytics from "@/context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import useClickableCard from "@/hooks/useClickableCard";
import OwaLink from "@/components/SharedComponents/OwaLink";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import Flex from "@/components/SharedComponents/Flex";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

export type SubjectCardListItemProps = Omit<CardProps, "children"> & {
  titleTag?: OakHeadingTag;
} & {
  subject: KeyStageSubject;
  keyStageSlug: string;
  keyStageTitle: string;
  isAvailable: boolean;
};

const SubjectCardListItem: FC<SubjectCardListItemProps> = ({
  titleTag = "h3",
  subject,
  isAvailable,
  keyStageSlug,
  keyStageTitle,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  const { subjectSlug, subjectTitle, programmeSlug, unitCount, lessonCount } =
    subject[0];

  const backgroundColor = isAvailable ? "lemon50" : "white";

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
      <OakFlex
        $background={backgroundColor}
        $position={"relative"}
        $width={"100%"}
        $pv="inner-padding-m"
      >
        <SubjectIcon
          subjectSlug={subjectSlug}
          height={96}
          width={96}
          $width={96}
          $ma={"auto"}
          $transform={isHovered ? "scale(1)" : "scale(0.8)"}
        />
      </OakFlex>
      {/* @todo replace with OakFlex - translate drop shadow names to correct names */}
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
            <OakHeading
              $font={["heading-7"]}
              tag={titleTag}
              $textAlign={"center"}
            >
              {subject.length === 1 ? (
                <OwaLink
                  {...primaryTargetProps}
                  page="unit-index"
                  programmeSlug={programmeSlug}
                >
                  {subjectTitle}
                </OwaLink>
              ) : (
                <OwaLink
                  {...primaryTargetProps}
                  page="programme-index"
                  keyStageSlug={keyStageSlug}
                  subjectSlug={subjectSlug}
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
                </OwaLink>
              )}
            </OakHeading>
            <OakTypography
              $font={"body-2"}
              $color={"grey60"}
            >{`${unitCount} units`}</OakTypography>
            <OakTypography
              $font={"body-2"}
              $color={"grey60"}
            >{`${lessonCount} lessons`}</OakTypography>
          </>
        ) : (
          <OakHeading
            $font={["heading-7"]}
            tag={titleTag}
            $textAlign={"center"}
          >
            {subjectTitle}
          </OakHeading>
        )}
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectCardListItem;
