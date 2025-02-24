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
  OakLI,
  OakP,
  OakPrimaryButton,
  OakPrimaryInvertedButton,
  OakSpan,
  OakStaticMessageCard,
  OakUL,
} from "@oaknational/oak-components";
import { useEffect } from "react";
import byteSize from "byte-size";

import { useWorksheetDownload } from "./useWorksheetDownload";
import { useAdditionalFilesDownload } from "./useAdditionalFilesDownload";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";

export type WorksheetInfo = {
  item: string;
  exists: boolean;
  fileSize: string | undefined;
  ext: string | undefined;
}[];

export type PupilViewsIntroProps = LessonContent & {
  hasWorksheet: boolean;
  worksheetInfo: WorksheetInfo | null;
};

export const PupilViewsIntro = (props: PupilViewsIntroProps) => {
  const {
    contentGuidance,
    supervisionLevel,
    equipmentAndResources,
    isLegacy,
    lessonSlug,
    hasWorksheet,
    hasAdditionalFiles,
    additionalFiles,
    worksheetInfo,
  } = props;
  const {
    completeActivity,
    updateCurrentSection,
    updateWorksheetDownloaded,
    currentSection,
    timeStamp,
    updateSectionResult,
    sectionResults,
    proceedToNextSection,
    lessonReviewSections,
    updateAdditionalFilesDownloaded,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();
  const { trackSectionStarted } = useTrackSectionStarted();
  const { startDownload, isDownloading } = useWorksheetDownload(
    lessonSlug,
    isLegacy ?? false,
  );
  const fileInfo = (
    <OakSpan>
      ({worksheetInfo?.[0]?.ext?.toUpperCase()} {worksheetInfo?.[0]?.fileSize})
    </OakSpan>
  );
  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(lessonSlug);
  const { track } = usePupilAnalytics();

  useEffect(() => {
    if (
      sectionResults.intro?.worksheetAvailable === undefined &&
      currentSection === "intro"
    ) {
      sectionResults.intro?.worksheetDownloaded ||
        updateSectionResult({
          worksheetDownloaded:
            sectionResults.intro?.worksheetDownloaded || false,
          worksheetAvailable: hasWorksheet ? true : false,
        });
    }
  }, [hasWorksheet, sectionResults.intro, updateSectionResult, currentSection]);

  const handleDownloadClicked = () => {
    updateWorksheetDownloaded({
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
    startDownload().then(() => {
      if (track.lessonActivityDownloadedWorksheet) {
        track.lessonActivityDownloadedWorksheet({});
      }
    });
  };

  const handleAdditionalFilesDownloadClicked = () => {
    updateAdditionalFilesDownloaded({
      filesDownloaded: true,
      additionalFilesAvailable: true,
    });
    startAdditionalFilesDownload();
  };

  const handleBackLinkClick = () => {
    if (track.lessonActivityAbandonedIntroduction) {
      track.lessonActivityAbandonedIntroduction({
        pupilExperienceLessonActivity: "intro",
        activityTimeSpent: new Date().getTime() - timeStamp.time,
      });
    }
    updateCurrentSection("overview");
  };

  const topNavSlot = (
    <OakLessonTopNav
      backLinkSlot={
        <OakBackLink
          {...getSectionLinkProps("overview", handleBackLinkClick)}
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

  const handleBottomButtonClick = () => {
    if (sectionResults.intro?.isComplete) {
      const nextSection =
        lessonReviewSections.find(
          (section) => !sectionResults[section]?.isComplete,
        ) ?? "review";
      trackSectionStarted(nextSection);
      proceedToNextSection();
    } else {
      completeActivity("intro");
      if (track.lessonActivityCompletedIntroduction) {
        track.lessonActivityCompletedIntroduction({
          pupilExperienceLessonActivity: "intro",
          activityTimeSpent: new Date().getTime() - timeStamp.time,
        });
      }
    }
  };

  const bottomNavSlot = (
    <OakLessonBottomNav>
      <OakPrimaryButton
        element="a"
        {...getSectionLinkProps("overview", handleBottomButtonClick)}
        width={["100%", "max-content"]}
        isTrailingIcon
        iconName="arrow-right"
      >
        {sectionResults.intro?.isComplete ? "Continue lesson" : "I'm ready"}
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );

  const removedGuidanceDuplicates = Array.from(
    new Set(
      contentGuidance?.map((guidance) => guidance.contentguidanceLabel || ""),
    ),
  );

  return (
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
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 10]}
          $mb={["space-between-m", "space-between-l", "space-between-xl"]}
        >
          <OakHeading tag="h1" $font={["heading-5", "heading-4", "heading-3"]}>
            What will you need for this lesson?
          </OakHeading>
        </OakGridArea>
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
            {hasAdditionalFiles && additionalFiles?.[0]?.files[0] && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="additional-material" tag="h1">
                  Files you will need for this lesson
                </OakCardHeader>
                {additionalFiles[0].files.length === 1 ? (
                  additionalFileSingle(additionalFiles[0].files[0])
                ) : (
                  <OakUL
                    $display={"flex"}
                    $flexDirection={"column"}
                    $gap={"space-between-s"}
                  >
                    {additionalFiles[0].files.map((file, index) =>
                      additionalFileListItem(file, index),
                    )}
                  </OakUL>
                )}
                <OakFlex $justifyContent={"flex-end"}>
                  <OakPrimaryInvertedButton
                    onClick={handleAdditionalFilesDownloadClicked}
                    isLoading={isAdditionalFilesDownloading}
                    iconName="download"
                    isTrailingIcon
                    $font={"heading-7"}
                  >
                    {additionalFiles[0].files.length === 1
                      ? "Download file"
                      : "Download files"}
                  </OakPrimaryInvertedButton>
                </OakFlex>
              </OakLessonInfoCard>
            )}
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
                    Download worksheet {fileInfo}
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
      </OakGrid>
    </OakLessonLayout>
  );
};

export function additionalFileListItem(
  file: { title: string; fileObject: { bytes: number; format: string } },
  index: number,
) {
  return (
    <OakLI key={index}>
      <OakFlex $flexDirection={"column"}>
        <OakSpan>{file.title}</OakSpan>
        <OakSpan>{`${byteSize(file.fileObject.bytes)} (${file.fileObject.format.toUpperCase()})`}</OakSpan>
      </OakFlex>
    </OakLI>
  );
}

export function additionalFileSingle(file: {
  title: string;
  fileObject: { bytes: number; format: string };
}) {
  return (
    <OakFlex $flexDirection={"column"}>
      <OakSpan>{file.title}</OakSpan>
      <OakSpan>{`${byteSize(file.fileObject.bytes)} (${file.fileObject.format.toUpperCase()})`}</OakSpan>
    </OakFlex>
  );
}
