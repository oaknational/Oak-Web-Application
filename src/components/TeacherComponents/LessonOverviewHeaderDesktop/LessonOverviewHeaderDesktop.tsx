import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakBox,
  OakTertiaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { LessonOverviewCreateWithAiDropdown } from "../LessonOverviewCreateWithAiDropdown";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import CopyrightRestrictionBanner from "@/components/TeacherComponents/CopyrightRestrictionBanner/CopyrightRestrictionBanner";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import { resolveOakHref } from "@/common-lib/urls";

const CustomDimensionRow = styled(OakFlex)`
  width: 200px;
  @media (max-width: 1280px) {
    width: 172px;
  }
`;
const CustomDimensionSquare = styled(CustomDimensionRow)`
  height: 200px;
  @media (max-width: 1280px) {
    height: 172px;
  }
`;

export const LessonOverviewHeaderDesktop: FC<
  LessonOverviewHeaderProps & { shareButtons: React.ReactNode }
> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    tierTitle,
    examBoardTitle,
    lessonTitle,
    isNew,
    subjectIconBackgroundColor,
    pupilLessonOutcome,
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
    <OakBox $display={["none", "grid"]}>
      <OakGrid>
        <OakGridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <OakFlex
            $flexDirection={"column"}
            $alignItems={"flex-start"}
            $gap={"space-between-m2"}
          >
            {shouldShowBackButton && (
              <CustomDimensionRow data-testid={"back-button-row"}>
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
              </CustomDimensionRow>
            )}
            <CustomDimensionSquare>
              <SubjectIconBrushBorders
                subjectSlug={subjectSlug}
                color={subjectIconBackgroundColor}
                isNew={isNew}
              />
            </CustomDimensionSquare>
          </OakFlex>
        </OakGridArea>
        <OakGridArea
          $justifyContent={"flex-start"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
          <OakFlex $flexDirection={"column"} $gap="all-spacing-2">
            {shouldShowBackButton && (
              <OakTagFunctional
                data-testid={"lesson-count-tag"}
                label={`Lesson ${orderInUnit} of ${unitTotalLessonCount}`}
                $background={"bg-decorative4-main"}
                $mb={"space-between-s"}
                $width={"fit-content"}
                useSpan={true}
              />
            )}
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
                {shareButtons}
                {!excludedFromTeachingMaterials && isCreateWithAiEnabled && (
                  <LessonOverviewCreateWithAiDropdown {...props} />
                )}
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
