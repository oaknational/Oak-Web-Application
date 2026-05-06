"use client";

import {
  OakBox,
  OakDownloadCard,
  OakDownloadsJourneyChildSubjectTierSelector,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPrimaryButton,
  OakTagFunctional,
  OakTertiaryInvertedButton,
  Subject,
  Tier,
} from "@oaknational/oak-components";
import { mapKeys, camelCase, capitalize } from "lodash";
import {
  useMemo,
  useState,
  useLayoutEffect,
  useEffect,
  ChangeEvent,
} from "react";
import { Controller } from "react-hook-form";

import {
  CurriculumDownloadsTierSubjectProps,
  CurriculumUnitsFormattedData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import {
  ResourceTypeValueType,
  PhaseValueType,
  LearningTierValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import CurricSuccessMessage from "@/components/CurriculumComponents/CurricSuccessMessage";
import { saveDownloadsDataToLocalStorage } from "@/components/CurriculumComponents/CurriculumDownloadTab/helper";
import { DOWNLOAD_TYPE_LABELS } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";
import { DownloadPageWithAccordionContent } from "@/components/TeacherComponents/DownloadPageWithAccordion/DownloadPageWithAccordion";
import {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import { useOnboardingStatus } from "@/components/TeacherComponents/hooks/useOnboardingStatus";
import { DelayedLoadingSpinner } from "@/components/TeacherComponents/SharePageLayout/SharePageLayout";
import {
  ResourceFormValues,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { doUnitsHaveNc, flatUnitsFromYearData } from "@/utils/curriculum/units";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
export type ProgrammeDownloadsProps = {
  mvRefreshTime: number;
  curriculumInfo: CurriculumOverviewMVData;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
};

export const trackCurriculumDownload = async (
  data: ResourceFormValues,
  subjectTitle: string,
  onHubspotSubmit: (data: ResourceFormProps) => Promise<string | undefined>,
  track: ReturnType<typeof useAnalytics>["track"],
  curriculumSelectionSlugs: CurriculumSelectionSlugs,
) => {
  if (!data.terms) return;
  const schoolOption = getSchoolOption(data.school);

  await onHubspotSubmit({
    school: data.school,
    schoolName: data.schoolName,
    email: data.email,
    terms: data.terms,
    resources: data.resources,
    onSubmit: async () => {},
  });

  track.curriculumResourcesDownloaded({
    platform: "owa",
    product: "curriculum resources",
    engagementIntent: "explore",
    componentType: "download_button",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    emailSupplied: data.email != null,
    resourceType: ["curriculum document"] as ResourceTypeValueType[],
    schoolOption,
    schoolName: getSchoolName(data.school, schoolOption),
    subjectTitle: subjectTitle,
    phase: curriculumSelectionSlugs.phaseSlug as PhaseValueType,
    schoolUrn: getSchoolUrn(data.school, schoolOption),
    keyStageSlug: null,
    keyStageTitle: null,
  });
};

export const ProgrammeDownloads = ({
  curriculumDownloadsTabData,
  curriculumUnitsFormattedData,
  curriculumSelectionSlugs,
  mvRefreshTime,
  curriculumInfo,
}: ProgrammeDownloadsProps) => {
  const { track } = useAnalytics();
  const { onHubspotSubmit } = useHubspotSubmit();
  const onboardingStatus = useOnboardingStatus();
  const isLoading = onboardingStatus === "loading";

  const availableDownloadTypes = useMemo(() => {
    return DOWNLOAD_TYPE_LABELS.map(({ id }) => id).filter((id) => {
      if (id === "national-curriculum") {
        return doUnitsHaveNc(
          flatUnitsFromYearData(curriculumUnitsFormattedData.yearData),
        );
      }
      return true;
    });
  }, [curriculumUnitsFormattedData]);

  const curriculumDownloadsWithLabels = DOWNLOAD_TYPE_LABELS.filter(({ id }) =>
    availableDownloadTypes.includes(id),
  );

  // Convert the data into OWA component format (using camelCase instead of snake_case for keys.)
  const [tierSelected, setTierSelected] = useState<string | null>(null);
  const [childSubjectSelected, setChildSubjectSelected] = useState<
    string | null
  >(null);
  const tiers = useMemo<Tier[]>(() => {
    return curriculumDownloadsTabData.tiers &&
      curriculumDownloadsTabData.tiers.length > 0
      ? curriculumDownloadsTabData.tiers.map(
          (tier) =>
            mapKeys(tier, (_, key) => camelCase(key)) as unknown as Tier,
        )
      : [];
  }, [curriculumDownloadsTabData.tiers]);

  const {
    form,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    isLocalStorageLoading,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    hasFormErrors,
    localStorageDetails,
    handleToggleSelectAll,
    selectAllChecked,
    hubspotLoaded,
  } = useResourceFormState({
    type: "curriculum",
    curriculumResources: availableDownloadTypes,
  });

  const childSubjects = useMemo<Subject[]>(() => {
    return curriculumDownloadsTabData.child_subjects &&
      curriculumDownloadsTabData.child_subjects.length > 0
      ? curriculumDownloadsTabData.child_subjects.map(
          (subject) =>
            mapKeys(subject, (_, key) => camelCase(key)) as unknown as Subject,
        )
      : [];
  }, [curriculumDownloadsTabData.child_subjects]);

  const [isDone, setIsDone] = useState(false);
  const [subjectTierSelectionVisible, setSubjectTierSelectionVisible] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  let onBackToKs4Options: undefined | (() => void);
  if (tiers.length > 0 || childSubjects.length > 0) {
    onBackToKs4Options = () => {
      setSubjectTierSelectionVisible(true);
    };
  }

  useLayoutEffect(() => {
    setChildSubjectSelected(null);
    setTierSelected(null);
    // Set the subject tier selector as visible when tiers & curriculumDownloadsTabData.child_subjects are present
    if (
      (curriculumDownloadsTabData.tiers &&
        curriculumDownloadsTabData.tiers.length > 0) ||
      (curriculumDownloadsTabData.child_subjects &&
        curriculumDownloadsTabData.child_subjects.length > 0)
    ) {
      setSubjectTierSelectionVisible(true);
    } else {
      setSubjectTierSelectionVisible(false);
    }
  }, [
    curriculumSelectionSlugs,
    curriculumDownloadsTabData.tiers,
    curriculumDownloadsTabData.child_subjects,
  ]);

  useEffect(() => {
    setIsDone(false);
  }, [curriculumSelectionSlugs]);

  const handleSubjectTierSelectionAnalytics = (
    tierSelected: string | null | undefined,
    childSubjectSlug: string | null | undefined,
  ) => {
    track.curriculumResourcesDownloadRefined({
      subjectTitle: curriculumInfo.subjectTitle,
      subjectSlug: curriculumSelectionSlugs.subjectSlug,
      platform: "owa",
      product: "curriculum resources",
      engagementIntent: "refine",
      componentType: "download_tab",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      learningTier: capitalize(tierSelected || "") as LearningTierValueType,
      childSubjectName: convertUnitSlugToTitle(childSubjectSlug || ""),
      childSubjectSlug: childSubjectSlug || "",
    });
  };

  const handleTierSubjectSelection = (
    tierSlug: string,
    childSubjectSlug?: string | null,
  ) => {
    setSubjectTierSelectionVisible(false);
    if (tierSlug && tierSlug.length > 0) {
      setTierSelected(tierSlug);
    }
    if (childSubjectSlug && childSubjectSlug.length > 0) {
      setChildSubjectSelected(childSubjectSlug);
    }
    handleSubjectTierSelectionAnalytics(tierSlug, childSubjectSlug);
  };

  const onSubmit = async (data: ResourceFormValues) => {
    setIsSubmitting(true);
    setSubmitError(undefined);
    const reportError = errorReporter("curriculum-download", {
      subjectSlug: curriculumSelectionSlugs.subjectSlug,
      phaseSlug: curriculumSelectionSlugs.phaseSlug,
      ks4OptionSlug: curriculumSelectionSlugs.ks4OptionSlug,
      tierSelected,
      childSubjectSelected,
    });

    const downloadPath = createCurriculumDownloadsUrl(
      data.resources,
      "published",
      mvRefreshTime,
      curriculumSelectionSlugs.subjectSlug,
      curriculumSelectionSlugs.phaseSlug,
      curriculumSelectionSlugs.ks4OptionSlug,
      tierSelected,
      childSubjectSelected,
    );

    const schoolData = {
      schoolId: data.school!,
      schoolName: data.schoolName!,
      email: data.email!,
      termsAndConditions: data.terms!,
      schoolNotListed: data.schoolName === "notListed",
    };
    saveDownloadsDataToLocalStorage(schoolData); // TODO: check local storage

    try {
      await downloadFileFromUrl(downloadPath);
      await trackCurriculumDownload(
        data,
        curriculumInfo.subjectTitle,
        onHubspotSubmit,
        track,
        curriculumSelectionSlugs,
      );
      setIsDone(true);
    } catch (err) {
      reportError(err, { severity: "warning" });
      setSubmitError(
        "There was an error downloading your files. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      // TODO: use DownloadSuccessHeader
      <OakBox $pv={["spacing-48"]}>
        <CurricSuccessMessage
          title="Thanks for downloading"
          message="We hope you find the resources useful. Click the question mark in the bottom-right corner to share your feedback."
          buttonProps={{
            label: "Back to downloads",
            onClick: () => {
              setIsDone(false);
            },
          }}
        />
      </OakBox>
    );
  }

  const noResourcesSelected =
    form.watch().resources === undefined || form.watch().resources.length === 0;

  // 40px padding on desktop allows the content to fill the max width, but always have inline padding
  // so it doesn't run up against the edge of the screen
  return (
    <OakBox
      id="curriculum-downloads"
      aria-labelledby="curriculum-downloads-heading"
      tabIndex={-1}
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-20", "spacing-40"]}
      $pt={["spacing-48", "spacing-0"]}
      $pb={["spacing-48"]}
      $mt={["spacing-0", "spacing-56", "spacing-56"]}
      $borderColor="border-error"
      $width={"100%"}
      role="region"
    >
      {subjectTierSelectionVisible === true ? (
        <OakDownloadsJourneyChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={handleTierSubjectSelection}
        />
      ) : (
        <OakGrid>
          <OakGridArea
            $flexDirection={"column"}
            $gap={"spacing-48"}
            $colSpan={[12, 8]}
            $colStart={[1, 3]}
          >
            {onBackToKs4Options && (
              <OakTertiaryInvertedButton
                onClick={onBackToKs4Options}
                iconName="arrow-left"
              >
                Back to KS4 Options
              </OakTertiaryInvertedButton>
            )}
            <OakHeading tag="h2" $font={"heading-4"}>
              Download curriculum resources
            </OakHeading>
            {isLoading ? (
              <OakBox $minHeight="spacing-480">
                <DelayedLoadingSpinner $delay={300} data-testid="loading" />
              </OakBox>
            ) : (
              <DownloadPageWithAccordionContent
                loginRequired={false}
                geoRestricted={false}
                downloadsRestricted={false}
                errors={form.errors}
                handleToggleSelectAll={handleToggleSelectAll}
                selectAllChecked={selectAllChecked}
                showNoResources={false}
                showLoading={isLocalStorageLoading}
                email={emailFromLocalStorage}
                school={schoolNameFromLocalStorage}
                schoolId={schoolIdFromLocalStorage}
                setSchool={setSchool}
                showSavedDetails={shouldDisplayDetailsCompleted}
                onEditClick={handleEditDetailsCompletedClick}
                register={form.register}
                control={form.control}
                showPostAlbCopyright={true}
                triggerForm={form.trigger}
                apiError={submitError}
                cardGroup={
                  <OakFlex $gap={"spacing-16"}>
                    {curriculumDownloadsWithLabels.map((download) => (
                      <Controller
                        key={download.id}
                        control={form.control}
                        name="resources"
                        defaultValue={[]}
                        render={({
                          field: { value: fieldValue, onChange },
                        }) => {
                          const onChangeHandler = (
                            e: ChangeEvent<HTMLInputElement>,
                          ) => {
                            if (e.target.checked) {
                              onChange([...fieldValue, download.id]);
                            } else {
                              onChange(
                                fieldValue.filter((val) => val !== download.id),
                              );
                            }
                            // Trigger the form to reevaluate errors
                            form.trigger();
                          };

                          return (
                            <OakDownloadCard
                              key={download.id}
                              id={download.id}
                              data-testid="resourceCard"
                              value={download.id}
                              name="curriculum-download"
                              titleSlot={download.label}
                              checked={fieldValue.includes(download.id)}
                              formatSlot={
                                <OakFlex
                                  $alignItems={"center"}
                                  $gap={"spacing-8"}
                                >
                                  ({download.fileExt})
                                  <OakTagFunctional
                                    $background={"bg-decorative2-main"}
                                    label="Editable"
                                  />
                                </OakFlex>
                              }
                              iconName={download.icon}
                              onChange={onChangeHandler}
                            />
                          );
                        }}
                      />
                    ))}
                  </OakFlex>
                }
                copyrightYear={new Date().getFullYear().toString()}
                showTermsAgreement={
                  onboardingStatus === "not-onboarded" ||
                  onboardingStatus === "unknown"
                }
                cta={
                  <OakPrimaryButton
                    type="button"
                    onClick={
                      (event) => void form.handleSubmit(onSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
                    }
                    iconName={"download"}
                    isLoading={
                      isSubmitting || !hubspotLoaded // show loading state when waiting for latest school values to be populated from hubspot
                    }
                    disabled={
                      (hasFormErrors ||
                        noResourcesSelected ||
                        (!form.formState.isValid && !localStorageDetails)) &&
                      hubspotLoaded
                    }
                  >
                    Download
                  </OakPrimaryButton>
                }
                showRiskAssessmentBanner={false}
                curriculumDownloads={curriculumDownloadsWithLabels}
              />
            )}
          </OakGridArea>
        </OakGrid>
      )}
    </OakBox>
  );
};
