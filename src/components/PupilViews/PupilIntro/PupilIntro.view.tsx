import { useEffect } from "react";
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

import { useAdditionalFilesDownload } from "./useAdditionalFilesDownload";
import { useWorksheetDownload } from "./useWorksheetDownload";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import {
  LessonContent,
  AdditionalFile,
  AdditionalFiles,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";
import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";

export type WorksheetInfo = {
  item: string;
  exists: boolean;
  fileSize: string | undefined;
  ext: string | undefined;
}[];

export type PupilViewsIntroProps = LessonContent & {
  hasWorksheet: boolean;
  worksheetInfo: WorksheetInfo | null;
  hasAdditionalFiles: boolean;
  additionalFiles: AdditionalFiles["downloadableFiles"] | null;
  ageRestriction?: string | null;
};

export const PupilViewsIntro = (props: PupilViewsIntroProps) => {
  const {
    contentGuidance,
    supervisionLevel,
    ageRestriction,
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
  const additionalFilesAssetIds = additionalFiles
    ? additionalFiles.map((file) => file.assetId)
    : [];
  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(lessonSlug, additionalFilesAssetIds);
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
        $cg="spacing-16"
        $maxWidth={["100%", "spacing-640", "100%"]}
        $mb={["spacing-0", "spacing-16"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
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
          $mb={["spacing-24", "spacing-48", "spacing-56"]}
        >
          <OakHeading tag="h1" $font={["heading-5", "heading-4", "heading-3"]}>
            What will you need for this lesson?
          </OakHeading>
        </OakGridArea>
        <OakGridArea
          $colSpan={[12, 12, 5]}
          $colStart={[1, 1, 2]}
          $pb="spacing-24"
        >
          <OakFlex $maxWidth={["100%", "100%", "fit-content"]}>
            <OakStaticMessageCard>
              <OakCardHeader iconName="question-mark" tag="h2">
                Are you ready to learn?
              </OakCardHeader>
              <OakP>
                Are you sitting in a quiet space away from distractions?
              </OakP>
              <OakP>Do you have all the equipment you need?</OakP>
            </OakStaticMessageCard>
          </OakFlex>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 5]} $pb="spacing-24">
          <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
            {hasAdditionalFiles && !!additionalFiles?.length && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="additional-material" tag="h2">
                  {`File${additionalFiles.length > 1 ? "s" : ""} you will need for this lesson`}
                </OakCardHeader>
                <OakUL
                  $display={"flex"}
                  $flexDirection={"column"}
                  $gap={"spacing-16"}
                  $reset
                >
                  {additionalFiles.map((file, index) =>
                    additionalFileListItem(file, index),
                  )}
                </OakUL>
                <OakFlex $justifyContent={"flex-end"}>
                  <OakPrimaryInvertedButton
                    onClick={handleAdditionalFilesDownloadClicked}
                    isLoading={isAdditionalFilesDownloading}
                    iconName="download"
                    isTrailingIcon
                    $font={"heading-7"}
                  >
                    {additionalFiles.length === 1
                      ? "Download file"
                      : "Download files"}
                  </OakPrimaryInvertedButton>
                </OakFlex>
              </OakLessonInfoCard>
            )}
            {equipmentAndResources?.[0]?.equipment && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="equipment-required" tag="h2">
                  Equipment
                </OakCardHeader>
                <OakP $font={"body-1"}>
                  {equipmentAndResources?.[0]?.equipment}
                </OakP>
              </OakLessonInfoCard>
            )}
            {removedGuidanceDuplicates.length > 0 && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="content-guidance" tag="h2">
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
            {ageRestriction && removedGuidanceDuplicates.length === 0 && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="content-guidance" tag="h2">
                  Content guidance
                </OakCardHeader>
                <OakP $font={"body-1"} key={"age-restriction"}>
                  Speak to an adult before starting this lesson.
                </OakP>
              </OakLessonInfoCard>
            )}
            {supervisionLevel && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="supervision-level" tag="h2">
                  Supervision
                </OakCardHeader>
                <OakP $font={"body-1"}>{supervisionLevel}</OakP>
              </OakLessonInfoCard>
            )}
            {hasWorksheet && (
              <OakLessonInfoCard>
                <OakCardHeader iconName="worksheet-3" tag="h2">
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
          $pt="spacing-24"
        >
          <OakFlex $alignItems={"center"} $mb="spacing-8">
            <OakBox $pa={"spacing-4"}>
              <OakIcon
                iconName={"copyright"}
                $height={"spacing-16"}
                $width={"spacing-16"}
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

export function additionalFileListItem(file: AdditionalFile, index: number) {
  const extension = file.mediaObject.url.split(".").pop();
  return (
    <OakLI key={index}>
      <OakFlex $flexDirection={"column"}>
        <OakSpan>{file.mediaObject.displayName}</OakSpan>
        <OakSpan>{`${convertBytesToMegabytes(file.mediaObject.bytes)} (${extension?.toUpperCase()})`}</OakSpan>
      </OakFlex>
    </OakLI>
  );
}
