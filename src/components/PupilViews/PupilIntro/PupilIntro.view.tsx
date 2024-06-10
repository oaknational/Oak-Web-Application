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
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export type PupilViewsIntroProps = LessonContent & {
  hasWorksheet: boolean;
};

export const PupilViewsIntro = (props: PupilViewsIntroProps) => {
  const {
    contentGuidance,
    supervisionLevel,
    equipmentAndResources,
    isLegacy,
    lessonSlug,
    hasWorksheet,
  } = props;
  const {
    completeSection,
    updateCurrentSection,
    updateSectionResult,
    sectionResults,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();
  const { startDownload, isDownloading } = useWorksheetDownload(
    lessonSlug,
    isLegacy ?? false,
  );

  const handleDownloadClicked = () => {
    updateSectionResult({
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
    startDownload();
  };

  if (!sectionResults.intro?.worksheetAvailable && hasWorksheet) {
    sectionResults.intro?.worksheetDownloaded ||
      updateSectionResult({
        worksheetDownloaded: sectionResults.intro?.worksheetDownloaded || false,
        worksheetAvailable: true,
      });
  }

  const topNavSlot = (
    <OakLessonTopNav
      backLinkSlot={
        <OakBackLink
          {...getSectionLinkProps("overview", updateCurrentSection)}
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
        element="a"
        {...getSectionLinkProps("overview", () => completeSection("intro"))}
        width={["100%", "max-content"]}
        isTrailingIcon
        iconName="arrow-right"
      >
        I'm ready
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );

  const removedGuidanceDuplicates = Array.from(
    new Set(
      contentGuidance?.map((guidance) => guidance.contentguidanceLabel || ""),
    ),
  );

  return (
    <MathJaxProvider>
      <OakLessonLayout
        lessonSectionName={"intro"}
        topNavSlot={topNavSlot}
        bottomNavSlot={bottomNavSlot}
      >
        <OakGrid
          $cg="all-spacing-4"
          $maxWidth={["100%", "all-spacing-22", "100%"]}
          $mb={["space-between-none", "space-between-s"]}
          $mh="auto"
          $ph={["inner-padding-m", "inner-padding-xl", "inner-padding-none"]}
          $minHeight="100%"
          $gridTemplateRows={[
            "min-content min-content 1fr",
            "min-content min-content 1fr",
            "min-content 1fr min-content",
          ]}
        >
          <OakHeading tag="h1" $font={["heading-5", "heading-4", "heading-3"]}>
            What will you need for this lesson?
          </OakHeading>
        </OakGrid>
        <OakGridArea
          $colSpan={[12, 12, 5]}
          $colStart={[1, 1, 2]}
          $pb="inner-padding-xl"
        >
          <OakFlex $maxWidth={["100%", "100%", "fit-content"]}>
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
        <OakGridArea $colSpan={[12, 12, 5]} $pb="inner-padding-xl">
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            {equipmentAndResources?.[0]?.equipment && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="equipment-required" tag="h1">
                  Equipment
                </OakCardHeader>
                <OakP $font={"body-1"}>
                  {equipmentAndResources?.[0]?.equipment}
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
                <OakCardHeader iconName="worksheet-3" tag="h1">
                  Worksheet
                </OakCardHeader>
                <OakP $font={"body-1"}>Optional</OakP>
                <OakFlex $justifyContent={"flex-end"}>
                  <OakPrimaryInvertedButton
                    onClick={handleDownloadClicked}
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
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 7]}
          $pt="inner-padding-xl"
        >
          <OakFlex $alignItems={"center"} $mb="space-between-ssx">
            <OakBox $pa={"inner-padding-ssx"}>
              <OakIcon
                iconName={"copyright"}
                $height={"all-spacing-4"}
                $width={"all-spacing-4"}
              />
            </OakBox>
            <OakSpan $font={"body-3-bold"}>Licence</OakSpan>
          </OakFlex>
          <CopyrightNotice isLegacyLicense={isLegacy ?? false} />
        </OakGridArea>
      </OakLessonLayout>
    </MathJaxProvider>
  );
};
