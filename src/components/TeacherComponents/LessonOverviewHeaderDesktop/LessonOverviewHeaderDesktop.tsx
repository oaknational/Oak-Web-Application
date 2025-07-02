import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import CopyrightRestrictionBanner from "@/components/TeacherComponents/CopyrightRestrictionBanner/CopyrightRestrictionBanner";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";

const CustomDimensionFlex = styled(OakFlex)`
  height: 200px;
  width: 200px;
  @media (max-width: 1280px) {
    height: 172px;
    width: 172px;
  }
`;

export const LessonOverviewHeaderDesktop: FC<LessonOverviewHeaderProps> = (
  props,
) => {
  const {
    subjectSlug,
    yearTitle,
    tierTitle,
    examBoardTitle,
    lessonTitle,
    isNew,
    subjectIconBackgroundColor,
    pupilLessonOutcome,
    showShare,
    isCanonical,
    phonicsOutcome,
    teacherShareButton,
    geoRestricted,
    loginRequired,
    isLegacy,
    lessonSlug,
    lessonReleaseDate,
    unitTitle,
    unitSlug,
  } = props;

  return (
    <OakBox $display={["none", "grid"]}>
      <OakGrid>
        <OakGridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <CustomDimensionFlex>
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              color={subjectIconBackgroundColor}
              isNew={isNew}
            />
          </CustomDimensionFlex>
        </OakGridArea>
        <OakGridArea
          $justifyContent={"center"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
          <OakFlex $flexDirection={"column"} $gap="all-spacing-2">
            {(examBoardTitle || yearTitle || tierTitle) && (
              <OakSpan $color={"grey60"} $font={"heading-light-7"}>
                <LessonMetadata
                  examBoardTitle={examBoardTitle}
                  yearTitle={yearTitle}
                  tierTitle={!isCanonical ? tierTitle : null}
                />
              </OakSpan>
            )}

            <OakFlex $flexDirection={"column"} $gap="all-spacing-6">
              <OakHeading tag={"h1"} $font={"heading-3"}>
                {lessonTitle}
              </OakHeading>
              <OakBox>
                {phonicsOutcome && (
                  <OakP $font={"body-2-bold"}>Learning outcomes</OakP>
                )}
                <OakBox $maxWidth={"all-spacing-23"}>
                  {pupilLessonOutcome && (
                    <OakP $font={"body-2"}>{pupilLessonOutcome}</OakP>
                  )}
                  {phonicsOutcome && (
                    <OakP $font={"body-2"}>{phonicsOutcome}</OakP>
                  )}
                </OakBox>
              </OakBox>
              <OakFlex
                $gap="space-between-s"
                $alignItems={"flex-start"}
                $flexWrap={"wrap"}
              >
                <LessonOverviewHeaderDownloadAllButton {...props} />
                {showShare && <LessonOverviewHeaderShareAllButton {...props} />}
                {teacherShareButton}
              </OakFlex>
              <CopyrightRestrictionBanner
                isGeorestricted={geoRestricted}
                isLoginRequired={loginRequired}
                componentType="lesson_overview"
                isLessonLegacy={isLegacy}
                lessonName={lessonTitle}
                lessonSlug={lessonSlug}
                lessonReleaseDate={lessonReleaseDate}
                unitName={unitTitle}
                unitSlug={unitSlug}
              />
            </OakFlex>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};
