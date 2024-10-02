import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakInlineBanner,
} from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";

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
    isSpecialist,
    geoRestricted,
  } = props;
  const authFlagEnabled = useFeatureFlagEnabled("use-auth-owa");

  return (
    <Box $display={["none", "grid"]}>
      <OakGrid>
        <OakGridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <Flex $height={[172, 172, 200]} $width={[172, 172, 200]}>
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              height={96}
              width={96}
              $maxHeight={140}
              $maxWidth={140}
              $ma={"auto"}
              color={subjectIconBackgroundColor}
              isNew={isNew}
            />
          </Flex>
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
                  tierTitle={tierTitle}
                />
              </OakSpan>
            )}

            <OakFlex $flexDirection={"column"} $gap="all-spacing-6">
              <OakHeading tag={"h1"} $font={"heading-3"}>
                {lessonTitle}
              </OakHeading>
              {pupilLessonOutcome && (
                <Box $maxWidth={740}>
                  <OakP $font={"body-2"}>{pupilLessonOutcome}</OakP>
                </Box>
              )}
              {authFlagEnabled && (
                <OakFlex>
                  <OakInlineBanner
                    $pv="inner-padding-ssx"
                    $ph={"inner-padding-s"}
                    type="info"
                    isOpen={Boolean(geoRestricted)}
                    message={"Downloads are available to UK users only"}
                  />
                </OakFlex>
              )}

              <OakFlex $gap="all-spacing-6">
                <LessonOverviewHeaderDownloadAllButton {...props} />
                {!isSpecialist && (
                  <LessonOverviewHeaderShareAllButton {...props} />
                )}
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </Box>
  );
};
