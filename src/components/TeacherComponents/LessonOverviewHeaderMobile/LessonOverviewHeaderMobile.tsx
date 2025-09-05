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
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { LessonOverviewCreateWithAiDropdown } from "../LessonOverviewCreateWithAiDropdown";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import CopyrightRestrictionBanner from "@/components/TeacherComponents/CopyrightRestrictionBanner/CopyrightRestrictionBanner";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import { resolveOakHref } from "@/common-lib/urls";

export const LessonOverviewHeaderMobile: FC<
  LessonOverviewHeaderProps & { shareButtons: React.ReactNode }
> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    examBoardTitle,
    tierTitle,
    lessonTitle,
    pupilLessonOutcome,
    isNew,
    subjectIconBackgroundColor,
    isCanonical,
    phonicsOutcome,
    orderInUnit,
    unitTotalLessonCount,
    breadcrumbs,
    programmeSlug,
    unitTitle,
    geoRestricted,
    loginRequired,
    isLegacy,
    lessonSlug,
    lessonReleaseDate,
    unitSlug,
    excludedFromTeachingMaterials,
    shareButtons,
  } = props;

  const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
  const shouldShowBackButton =
    !!previousBreadcrumb && !!unitTitle && !!programmeSlug;

  const isCreateWithAiEnabled =
    useFeatureFlagVariantKey("create-with-ai-button") === "test";

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
      {shareButtons}
      {!excludedFromTeachingMaterials && isCreateWithAiEnabled && (
        <LessonOverviewCreateWithAiDropdown {...props} />
      )}

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
  );
};
