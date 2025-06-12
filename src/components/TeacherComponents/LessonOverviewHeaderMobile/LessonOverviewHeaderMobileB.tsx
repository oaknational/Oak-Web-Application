import { FC } from "react";
import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakBox,
  OakTertiaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import { resolveOakHref } from "@/common-lib/urls";

export const LessonOverviewHeaderMobileB: FC<LessonOverviewHeaderProps> = (
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
    orderInUnit,
    unitTotalLessonCount,
    breadcrumbs,
    programmeSlug,
    unitTitle,
  } = props;

  const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
  const shouldShowBackButton =
    !!previousBreadcrumb && !!unitTitle && !!programmeSlug;

  return (
    <OakFlex
      $flexDirection={"column"}
      $display={["flex", "none"]}
      $gap={"all-spacing-6"}
    >
      <OakFlex $justifyContent={"space-between"} $alignItems={"center"}>
        {shouldShowBackButton && (
          <>
            <OakTertiaryButton
              element="a"
              href={
                "href" in previousBreadcrumb.oakLinkProps
                  ? previousBreadcrumb.oakLinkProps.href
                  : resolveOakHref(previousBreadcrumb.oakLinkProps)
              }
              iconName="arrow-left"
            >
              View unit
            </OakTertiaryButton>
            <OakTagFunctional
              label={`Lesson ${orderInUnit} of ${unitTotalLessonCount}`}
              $background={"bg-decorative4-main"}
              $width={"fit-content"}
              useSpan={true}
            />
          </>
        )}
      </OakFlex>
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
    </OakFlex>
  );
};
