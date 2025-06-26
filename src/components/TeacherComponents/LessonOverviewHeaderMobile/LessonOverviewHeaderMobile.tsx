import { FC } from "react";
import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import CopyrightRestrictionBanner from "@/components/TeacherComponents/CopyrightRestrictionBanner/CopyrightRestrictionBanner";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";

export const LessonOverviewHeaderMobile: FC<LessonOverviewHeaderProps> = (
  props,
) => {
  const {
    subjectSlug,
    yearTitle,
    examBoardTitle,
    tierTitle,
    lessonTitle,
    pupilLessonOutcome,
    isNew,
    subjectIconBackgroundColor,
    showShare,
    isCanonical,
    phonicsOutcome,
    teacherShareButton,
    geoRestricted,
    loginRequired,
  } = props;

  return (
    <OakFlex
      $flexDirection={"column"}
      $display={["flex", "none"]}
      $gap={"all-spacing-6"}
    >
      <OakFlex>
        <OakBox $mr="space-between-s" $height="all-spacing-13">
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            isNew={isNew}
            color={subjectIconBackgroundColor}
          />
        </OakBox>
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
          <OakHeading tag={"h1"} $font={"heading-5"}>
            {lessonTitle}
          </OakHeading>
        </OakFlex>
      </OakFlex>
      <OakBox>
        {phonicsOutcome && <OakP $font={"body-2-bold"}>Learning outcomes</OakP>}
        <OakBox>
          {pupilLessonOutcome && (
            <OakP $font={"body-2"}>{pupilLessonOutcome}</OakP>
          )}
          {phonicsOutcome && <OakP $font={"body-2"}>{phonicsOutcome}</OakP>}
        </OakBox>
      </OakBox>
      <LessonOverviewHeaderDownloadAllButton {...props} />
      {showShare && <LessonOverviewHeaderShareAllButton {...props} />}
      {teacherShareButton}
      {(geoRestricted || loginRequired) && (
        <CopyrightRestrictionBanner
          isGeorestricted={geoRestricted}
          isLoginRequired={loginRequired}
        />
      )}
    </OakFlex>
  );
};
