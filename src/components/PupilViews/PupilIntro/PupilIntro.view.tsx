import {
  OakBackLink,
  OakBox,
  OakCardHeader,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakLessonBottomNav,
  OakLessonInfoCard,
  OakLessonLayout,
  OakLessonTopNav,
  OakP,
  OakPrimaryButton,
  OakPrimaryInvertedButton,
  OakSpan,
  OakStaticMessageCard,
} from "@oaknational/oak-components";

import { useWorksheetDownload } from "./useWorksheetDownload";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import { ContentGuidance } from "@/components/TeacherComponents/LessonOverviewRequirements";

export type PupilViewsIntroProps = PupilLessonOverviewData & {
  hasWorksheet: boolean;
};

export const PupilViewsIntro = (props: PupilViewsIntroProps) => {
  const {
    contentGuidance,
    supervisionLevel,
    lessonEquipmentAndResources,
    isLegacyLicense,
    lessonSlug,
    hasWorksheet,
  } = props;
  const { completeSection, updateCurrentSection } = useLessonEngineContext();
  const { startDownload, isDownloading } = useWorksheetDownload(
    lessonSlug,
    isLegacyLicense,
  );

  const topNavSlot = (
    <OakLessonTopNav
      backLinkSlot={
        <OakBackLink
          type="button"
          onClick={() => {
            updateCurrentSection("overview");
          }}
        />
      }
      heading={"Introduction"}
      lessonSectionName={"intro"}
      mobileSummary={
        <OakSpan $color={"text-primary"} $font={"body-3"}>
          In progress...
        </OakSpan>
      }
    />
  );

  const bottomNavSlot = (
    <OakLessonBottomNav>
      <OakPrimaryButton
        type="button"
        width={["100%", "auto"]}
        onClick={() => {
          completeSection("intro");
        }}
      >
        I'm ready
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );

  const removedGuidanceDuplicates = Array.from(
    new Set(
      contentGuidance?.map(
        (guidance: ContentGuidance) => guidance.contentGuidanceLabel,
      ),
    ),
  );

  return (
    <OakLessonLayout
      lessonSectionName={"intro"}
      topNavSlot={topNavSlot}
      bottomNavSlot={bottomNavSlot}
    >
      <OakFlex $width={"100%"} $alignItems={"center"} $flexDirection={"column"}>
        <OakFlex
          $flexDirection={"column"}
          $gap={["space-between-m", "space-between-l", "space-between-xl"]}
          $maxWidth={["100%", "all-spacing-22", "all-spacing-23"]}
          $minWidth={["100%", "all-spacing-21", "all-spacing-23"]}
          $ph={["inner-padding-m", "inner-padding-none"]}
        >
          <OakHeading tag="h1" $font={["heading-5", "heading-4", "heading-3"]}>
            What will you need for this lesson?
          </OakHeading>
          <OakGrid
            $cg={"space-between-s"}
            $rg={["space-between-m2", "space-between-xl"]}
          >
            <OakGridArea $colSpan={[12, 12, 6]}>
              <OakFlex $maxWidth={["100%", "100%", "all-spacing-20"]}>
                <OakStaticMessageCard>
                  <OakCardHeader iconName="question-mark" tag="h1">
                    Are you ready to learn?
                  </OakCardHeader>
                  <OakP>
                    Are you sitting in a quiet space away from distractions?
                  </OakP>
                  <OakP>Do you have all the equipment you need?</OakP>
                </OakStaticMessageCard>
              </OakFlex>
            </OakGridArea>
            <OakGridArea $colSpan={[12, 12, 6]}>
              <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
                {lessonEquipmentAndResources?.[0]?.equipment && (
                  <OakLessonInfoCard>
                    <OakCardHeader iconName="equipment-required" tag="h1">
                      Equipment
                    </OakCardHeader>
                    <OakP $font={"body-1"}>
                      {lessonEquipmentAndResources?.[0]?.equipment}
                    </OakP>
                  </OakLessonInfoCard>
                )}
                {removedGuidanceDuplicates.length > 0 && (
                  <OakLessonInfoCard>
                    <OakCardHeader iconName="content-guidance" tag="h1">
                      Content guidance
                    </OakCardHeader>
                    {removedGuidanceDuplicates.map((guidance: string) => {
                      return (
                        <OakP $font={"body-1"} key={guidance}>
                          {guidance}
                        </OakP>
                      );
                    })}
                  </OakLessonInfoCard>
                )}
                {supervisionLevel && (
                  <OakLessonInfoCard>
                    <OakCardHeader iconName="supervision-level" tag="h1">
                      Supervision
                    </OakCardHeader>
                    <OakP $font={"body-1"}>{supervisionLevel}</OakP>
                  </OakLessonInfoCard>
                )}
                {hasWorksheet && (
                  <OakLessonInfoCard>
                    <OakCardHeader iconName="worksheet" tag="h1">
                      Worksheet
                    </OakCardHeader>
                    <OakP $font={"body-1"}>Optional</OakP>
                    <OakFlex $justifyContent={"flex-end"}>
                      <OakPrimaryInvertedButton
                        onClick={startDownload}
                        isLoading={isDownloading}
                        iconName="download"
                        isTrailingIcon
                        $font={"heading-7"}
                      >
                        Download worksheet
                      </OakPrimaryInvertedButton>
                    </OakFlex>
                  </OakLessonInfoCard>
                )}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakFlex $flexDirection={"column"} $gap={"space-between-ssx"}>
            <OakFlex $alignItems={"center"}>
              <OakBox $pa={"inner-padding-ssx"}>
                <OakIcon
                  iconName={"copyright"}
                  $height={"all-spacing-4"}
                  $width={"all-spacing-4"}
                />
              </OakBox>
              <OakSpan $font={"body-3-bold"}>Licence</OakSpan>
            </OakFlex>
            <OakP $font={"body-4"}>
              This content is © Oak National Academy Limited (2023), licensed
              on Open Government Licence version 3.0 except where otherwise
              stated. See Oak's terms & conditions (Collection 2).
            </OakP>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakLessonLayout>
  );
};
