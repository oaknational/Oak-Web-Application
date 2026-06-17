import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import {
  OakBackLink,
  OakFlex,
  OakP,
  OakPrimaryInvertedButton,
  OakSpan,
  OakLessonTopNav,
} from "@oaknational/oak-components";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  PupilLessonIntroAdditionalFileItem,
  PupilLessonIntroInfoCard,
  PupilLessonIntroLicence,
  PupilLessonIntroReadyCard,
  PupilLessonIntroView,
} from "@/components/PupilComponents/Views/PupilLessonIntro";
import { usePupilIntroExperience } from "@/components/PupilComponents/Views/Hooks";
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
  const {
    overviewHref,
    removedGuidanceDuplicates,
    proceedLabel,
    isAdditionalFilesDownloading,
    isDownloading,
    handleProceed,
    handleBackToOverview,
    handleAdditionalFilesDownload,
    handleWorksheetDownload,
  } = usePupilIntroExperience({
    browseData,
    lessonContent,
    hasWorksheet,
    additionalFiles,
  });

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
                handleBackToOverview();
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
                    onClick={handleAdditionalFilesDownload}
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
        proceedLabel,
        onProceed: handleProceed,
      }}
    />
  );
};

const PupilLessonIntroPage = (props: PupilLessonPageProps) => {
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

export default PupilLessonIntroPage;

export const getStaticPaths = getStaticPathsTemplate<IntroPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  IntroPageURLParams
> = async (context) => {
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
    page: "pupils-lesson-canonical-intro::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
