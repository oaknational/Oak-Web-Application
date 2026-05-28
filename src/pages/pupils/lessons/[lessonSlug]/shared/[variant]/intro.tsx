import { useEffect, useMemo, useRef, useState } from "react";
import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import {
  OakBackLink,
  OakFlex,
  OakP,
  OakPrimaryInvertedButton,
  OakSpan,
  OakLessonTopNav,
} from "@oaknational/oak-components";
import { useShallow } from "zustand/react/shallow";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { hasValidSharedVariant } from "@/pages-helpers/pupil/lessons-pages/validateSharedVariant";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  PupilLessonIntroAdditionalFileItem,
  PupilLessonIntroInfoCard,
  PupilLessonIntroLicence,
  PupilLessonIntroReadyCard,
  PupilLessonIntroView,
} from "@/components/PupilComponents/Views/PupilLessonIntro";
import {
  getAdditionalFileAssetIds,
  getDedupedContentGuidanceLabels,
  getIntroBottomNavLabel,
  getIntroWorksheetInitResult,
  getNewLessonSectionHref,
  pickNextIncompleteSection,
  shouldInitIntroWorksheetResult,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { useAdditionalFilesDownload } from "@/components/PupilViews/PupilIntro/useAdditionalFilesDownload";
import { useWorksheetDownload } from "@/components/PupilViews/PupilIntro/useWorksheetDownload";
import { useWorksheetInfoState } from "@/components/PupilComponents/pupilUtils/useWorksheetInfoState";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

type IntroPageURLParams = {
  lessonSlug: string;
};

const IntroPageContent = ({
  browseData,
  lessonContent,
  hasWorksheet,
  worksheetInfo,
  hasAdditionalFiles,
  additionalFiles,
}: Pick<
  PupilLessonPageProps,
  | "browseData"
  | "lessonContent"
  | "hasWorksheet"
  | "worksheetInfo"
  | "hasAdditionalFiles"
  | "additionalFiles"
>) => {
  const router = useRouter();
  const {
    sectionResults,
    lessonReviewSections,
    lessonStarted,
    isReadOnly,
    completeSection,
    updateSectionInProgressResult,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      lessonStarted: state.lessonStarted,
      isReadOnly: state.isReadOnly,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
    })),
  );
  const {
    trackSectionStarted,
    trackLessonStarted,
    trackLessonCompleted,
    trackIntroCompleted,
    trackIntroAbandoned,
    trackWorksheetDownloaded,
  } = usePupilLessonAnalytics();

  const additionalFilesAssetIds = useMemo(
    () => getAdditionalFileAssetIds(additionalFiles),
    [additionalFiles],
  );

  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(browseData.lessonSlug, additionalFilesAssetIds);
  const { startDownload, isDownloading } = useWorksheetDownload(
    browseData.lessonSlug,
    lessonContent.isLegacy ?? false,
  );
  const sectionStartedAtRef = useRef(Date.now());
  const [isCompletingAndRedirecting, setIsCompletingAndRedirecting] =
    useState(false);

  const currentSearchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  );
  const overviewHref = getNewLessonSectionHref({
    currentRoute: router.asPath,
    section: "overview",
    searchParams: currentSearchParams,
  });

  const getSectionResultsAfterComplete = () => ({
    ...sectionResults,
    intro: {
      ...sectionResults.intro,
      isComplete: true,
    },
  });

  useEffect(() => {
    if (
      shouldInitIntroWorksheetResult({
        worksheetAvailable: sectionResults.intro?.worksheetAvailable,
        currentSection: "intro",
      })
    ) {
      updateSectionInProgressResult(
        "intro",
        getIntroWorksheetInitResult({
          worksheetDownloaded: sectionResults.intro?.worksheetDownloaded,
          hasWorksheet,
        }),
      );
    }
  }, [
    hasWorksheet,
    sectionResults.intro?.worksheetAvailable,
    sectionResults.intro?.worksheetDownloaded,
    updateSectionInProgressResult,
  ]);

  const removedGuidanceDuplicates = getDedupedContentGuidanceLabels(
    lessonContent.contentGuidance,
  );

  const handleProceed = () => {
    if (!sectionResults.intro?.isComplete) {
      setIsCompletingAndRedirecting(true);
      if (!lessonStarted) {
        trackLessonStarted();
      }
      trackIntroCompleted({ sectionStartedAt: sectionStartedAtRef.current });
      completeSection("intro");
      const nextSectionResults = getSectionResultsAfterComplete();
      const allComplete = lessonReviewSections.every(
        (section) => nextSectionResults[section]?.isComplete,
      );
      if (allComplete) {
        trackLessonCompleted();
      }
      void router.push(
        getNewLessonSectionHref({
          currentRoute: router.asPath,
          section: allComplete ? "review" : "overview",
          searchParams: currentSearchParams,
        }),
      );
      return;
    }

    const nextSection = pickNextIncompleteSection({
      lessonReviewSections,
      sectionResults,
    });

    if (isReadOnly) {
      trackSectionStarted({ section: "review", sectionResults });
      void router.push(
        getNewLessonSectionHref({
          currentRoute: router.asPath,
          section: "review",
          searchParams: currentSearchParams,
        }),
      );
      return;
    }

    trackSectionStarted({ section: nextSection, sectionResults });
    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: nextSection,
        searchParams: currentSearchParams,
      }),
    );
  };

  const handleWorksheetDownload = async () => {
    updateSectionInProgressResult("intro", {
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
    if (!lessonStarted) {
      trackLessonStarted();
    }
    const isSuccess = await startDownload();
    if (isSuccess) {
      trackWorksheetDownloaded();
    }
  };

  return (
    <PupilLessonIntroView
      phase={browseData.programmeFields.phase as "primary" | "secondary"}
      topNavSlot={
        <OakLessonTopNav
          backLinkSlot={
            <OakBackLink
              href={overviewHref}
              label="Back"
              onClick={(event) => {
                event.preventDefault();
                if (!sectionResults.intro?.isComplete) {
                  if (!lessonStarted) {
                    trackLessonStarted();
                  }
                  trackIntroAbandoned({
                    sectionStartedAt: sectionStartedAtRef.current,
                  });
                }
                void router.push(overviewHref);
              }}
            />
          }
          heading="Introduction"
          lessonSectionName="intro"
          mobileSummary={<OakSpan $font="body-3">In progress...</OakSpan>}
        />
      }
      readyToLearnSlot={<PupilLessonIntroReadyCard />}
      lessonInfoSlot={
        <>
          {hasAdditionalFiles && !!additionalFiles?.length && (
            <PupilLessonIntroInfoCard
              title={`File${additionalFiles.length > 1 ? "s" : ""} you will need for this lesson`}
              iconName="additional-material"
            >
              <OakFlex $flexDirection="column" $gap="spacing-16">
                {additionalFiles.map((file) => (
                  <PupilLessonIntroAdditionalFileItem
                    key={file.assetId}
                    displayName={file.mediaObject.displayName}
                    bytes={file.mediaObject.bytes}
                    url={file.mediaObject.url}
                  />
                ))}
                <OakFlex $justifyContent="flex-end">
                  <OakPrimaryInvertedButton
                    onClick={() => {
                      updateSectionInProgressResult("intro", {
                        filesDownloaded: true,
                        additionalFilesAvailable: true,
                      });
                      void startAdditionalFilesDownload();
                    }}
                    isLoading={isAdditionalFilesDownloading}
                    iconName="download"
                    isTrailingIcon
                    $font="heading-7"
                  >
                    {additionalFiles.length === 1
                      ? "Download file"
                      : "Download files"}
                  </OakPrimaryInvertedButton>
                </OakFlex>
              </OakFlex>
            </PupilLessonIntroInfoCard>
          )}

          {lessonContent.equipmentAndResources?.[0]?.equipment && (
            <PupilLessonIntroInfoCard
              title="Equipment"
              iconName="equipment-required"
            >
              <OakP>{lessonContent.equipmentAndResources[0].equipment}</OakP>
            </PupilLessonIntroInfoCard>
          )}

          {(removedGuidanceDuplicates.length > 0 ||
            browseData.features?.ageRestriction) && (
            <PupilLessonIntroInfoCard
              title="Content guidance"
              iconName="content-guidance"
            >
              <OakFlex $flexDirection="column" $gap="spacing-8">
                {removedGuidanceDuplicates.length > 0 ? (
                  removedGuidanceDuplicates.map((guidance) => (
                    <OakP key={guidance}>{guidance}</OakP>
                  ))
                ) : (
                  <OakP>Speak to an adult before starting this lesson.</OakP>
                )}
              </OakFlex>
            </PupilLessonIntroInfoCard>
          )}

          {lessonContent.supervisionLevel && (
            <PupilLessonIntroInfoCard
              title="Supervision"
              iconName="supervision-level"
            >
              <OakP>{lessonContent.supervisionLevel}</OakP>
            </PupilLessonIntroInfoCard>
          )}

          {hasWorksheet && (
            <PupilLessonIntroInfoCard title="Worksheet" iconName="worksheet-3">
              <OakP>Optional</OakP>
              <OakFlex $justifyContent="flex-end">
                <OakPrimaryInvertedButton
                  onClick={() => {
                    void handleWorksheetDownload();
                  }}
                  isLoading={isDownloading}
                  iconName="download"
                  isTrailingIcon
                  $font="heading-7"
                >
                  Download worksheet{" "}
                  {worksheetInfo?.[0]?.ext && worksheetInfo?.[0]?.fileSize && (
                    <OakSpan>
                      ({worksheetInfo[0].ext.toUpperCase()}{" "}
                      {worksheetInfo[0].fileSize})
                    </OakSpan>
                  )}
                </OakPrimaryInvertedButton>
              </OakFlex>
            </PupilLessonIntroInfoCard>
          )}
        </>
      }
      licenceSlot={
        <PupilLessonIntroLicence isLegacyLicense={!!lessonContent.isLegacy} />
      }
      bottomNav={{
        proceedLabel: isCompletingAndRedirecting
          ? "I'm ready"
          : getIntroBottomNavLabel(sectionResults.intro?.isComplete),
        onProceed: handleProceed,
      }}
    />
  );
};

const PupilLessonIntroNewPage = (props: PupilLessonPageProps) => {
  const {
    browseData,
    lessonContent,
    hasWorksheet,
    worksheetInfo,
    hasAdditionalFiles,
    additionalFiles,
    variant,
  } = props;

  const { worksheetInfo: clientWorksheetInfo } = useWorksheetInfoState(
    hasWorksheet && worksheetInfo === null,
    browseData.lessonSlug,
  );
  const resolvedWorksheetInfo = worksheetInfo ?? clientWorksheetInfo;

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({
          title: browseData.lessonData.title,
          description: browseData.lessonData.pupilLessonOutcome,
        }),
        noIndex: true,
      }}
      pupilStores={{ browseData, lessonContent, variant }}
    >
      <IntroPageContent
        browseData={browseData}
        lessonContent={lessonContent}
        hasWorksheet={hasWorksheet}
        worksheetInfo={resolvedWorksheetInfo}
        hasAdditionalFiles={hasAdditionalFiles}
        additionalFiles={additionalFiles}
      />
    </PupilLayout>
  );
};

export default PupilLessonIntroNewPage;

export const getStaticPaths = getStaticPathsTemplate<IntroPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  IntroPageURLParams
> = async (context) => {
  if (!hasValidSharedVariant(context)) {
    return { notFound: true };
  }

  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "intro",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-new-intro::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
