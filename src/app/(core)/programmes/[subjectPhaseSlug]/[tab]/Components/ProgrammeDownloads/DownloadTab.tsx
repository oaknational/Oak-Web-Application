import {
  ChangeEvent,
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  OakHeading,
  OakDownloadsJourneyChildSubjectTierSelector,
  Tier,
  Subject,
  OakBox,
  OakBoxProps,
  OakFlex,
  OakPrimaryButton,
  OakDownloadCard,
} from "@oaknational/oak-components";
import { mapKeys, camelCase, capitalize } from "lodash";
import { Controller } from "react-hook-form";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/ScreenReaderOnly";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import {
  AnalyticsUseCaseValueType,
  LearningTierValueType,
  PhaseValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { extractUrnAndSchool } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import {
  ResourceFormProps,
  ResourceFormValues,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import errorReporter from "@/common-lib/error-reporter";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { doUnitsHaveNc, flatUnitsFromYearData } from "@/utils/curriculum/units";
import CurricSuccessMessage from "@/components/CurriculumComponents/CurricSuccessMessage";
import {
  useDownloadsLocalStorage,
  saveDownloadsDataToLocalStorage,
} from "@/components/CurriculumComponents/CurriculumDownloadTab/helper";
import { DOWNLOAD_TYPE_LABELS } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import { DownloadPageWithAccordionContent } from "@/components/TeacherComponents/DownloadPageWithAccordion/DownloadPageWithAccordion";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";

export const trackCurriculumDownload = async (
  data: ResourceFormValues,
  subjectTitle: string,
  onHubspotSubmit: (data: ResourceFormProps) => Promise<string | undefined>,
  track: ReturnType<typeof useAnalytics>["track"],
  analyticsUseCase: AnalyticsUseCaseValueType,
  slugs: CurriculumSelectionSlugs,
) => {
  const { school, schoolName: dataSchoolName, email } = data;

  if (!data.terms) return;

  const schoolName =
    dataSchoolName === "Homeschool" ? "Homeschool" : "Selected school"; // TODO: check homeschool val
  const schoolOption =
    (school === "not-listed") === true ? "Not listed" : schoolName; // TODO: check not listed val

  await onHubspotSubmit({
    school: data.school ?? "notListed",
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
    analyticsUseCase: analyticsUseCase,
    emailSupplied: email != null,
    resourceType: ["curriculum document"] as ResourceTypeValueType[],
    schoolOption: schoolOption,
    schoolName: dataSchoolName || "",
    subjectTitle: subjectTitle,
    phase: slugs.phaseSlug as PhaseValueType,
    schoolUrn:
      !school || school === "homeschool"
        ? ""
        : (extractUrnAndSchool(school).urn ?? ""), // TODO: check
    keyStageSlug: null,
    keyStageTitle: null,
  });
};

export type CurriculumDownloadTabProps = {
  mvRefreshTime: number;
  curriculumInfo: CurriculumOverviewMVData;
  slugs: CurriculumSelectionSlugs;
  tiers: { tier: string; tier_slug: string }[];
  child_subjects?: { subject: string; subject_slug: string }[];
  formattedData: CurriculumUnitsFormattedData;
  /**
   * Inline padding for the content area.
   *
   * The integrated programme page layout has different padding requirements, so
   * so we use this prop to control the padding.
   *
   * Can be removed once the integrated programme page is launched and components are reorganised.
   */
  ph?: OakBoxProps["$ph"];
};
const DownloadTab: FC<CurriculumDownloadTabProps> = ({
  mvRefreshTime,
  slugs,
  tiers: snake_tiers,
  child_subjects,
  curriculumInfo,
  formattedData,
  ph = "spacing-16",
}) => {
  const { track } = useAnalytics();
  const { onHubspotSubmit } = useHubspotSubmit();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const availableDownloadTypes = useMemo(() => {
    return DOWNLOAD_TYPE_LABELS.map(({ id }) => id).filter((id) => {
      if (id === "national-curriculum") {
        return doUnitsHaveNc(flatUnitsFromYearData(formattedData.yearData));
      }
      return true;
    });
  }, [formattedData]);

  // Convert the data into OWA component format (using camelCase instead of snake_case for keys.)
  const [tierSelected, setTierSelected] = useState<string | null>(null);
  const [childSubjectSelected, setChildSubjectSelected] = useState<
    string | null
  >(null);
  const tiers = useMemo<Tier[]>(() => {
    return snake_tiers && snake_tiers.length > 0
      ? snake_tiers.map(
          (tier) =>
            mapKeys(tier, (value, key) => camelCase(key)) as unknown as Tier,
        )
      : [];
  }, [snake_tiers]);

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

  // TODO: default check

  const childSubjects = useMemo<Subject[]>(() => {
    return child_subjects && child_subjects.length > 0
      ? child_subjects.map(
          (subject) =>
            mapKeys(subject, (value, key) =>
              camelCase(key),
            ) as unknown as Subject,
        )
      : [];
  }, [child_subjects]);

  const { isLoading } = useDownloadsLocalStorage();
  const [isDone, setIsDone] = useState(false);
  const [subjectTierSelectionVisible, setSubjectTierSelectionVisible] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    setChildSubjectSelected(null);
    setTierSelected(null);
    // Set the subject tier selector as visible when tiers & child_subjects are present
    if (
      (snake_tiers && snake_tiers.length > 0) ||
      (child_subjects && child_subjects.length > 0)
    ) {
      setSubjectTierSelectionVisible(true);
    } else {
      setSubjectTierSelectionVisible(false);
    }
  }, [slugs, snake_tiers, child_subjects]);

  useEffect(() => {
    setIsDone(false);
  }, [slugs]);

  const handleSubjectTierSelectionAnalytics = (
    tierSelected: string | null | undefined,
    childSubjectSlug: string | null | undefined,
  ) => {
    track.curriculumResourcesDownloadRefined({
      subjectTitle: curriculumInfo.subjectTitle,
      subjectSlug: slugs.subjectSlug,
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
      subjectSlug: slugs.subjectSlug,
      phaseSlug: slugs.phaseSlug,
      ks4OptionSlug: slugs.ks4OptionSlug,
      tierSelected,
      childSubjectSelected,
    });

    const downloadPath = createCurriculumDownloadsUrl(
      data.resources,
      "published",
      mvRefreshTime,
      slugs.subjectSlug,
      slugs.phaseSlug,
      slugs.ks4OptionSlug,
      tierSelected,
      childSubjectSelected,
    );

    const schoolData = {
      schoolId: data.school!,
      schoolName: data.schoolName!,
      email: data.email!,
      termsAndConditions: data.terms!,
      schoolNotListed: data.schoolName === "not listed", // TODO: check not listed
    };
    saveDownloadsDataToLocalStorage(schoolData); // TODO: check local storage

    try {
      await downloadFileFromUrl(downloadPath);
      await trackCurriculumDownload(
        data,
        curriculumInfo.subjectTitle,
        onHubspotSubmit,
        track,
        analyticsUseCase,
        slugs,
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

  return (
    <OakBox
      id="curriculum-downloads"
      aria-labelledby="curriculum-downloads-heading"
      tabIndex={-1}
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={ph}
      $pt={["spacing-48", "spacing-0"]}
      $pb={["spacing-48"]}
      $mt={["spacing-0", "spacing-56", "spacing-56"]}
      $borderColor="border-error"
      $width={"100%"}
      role="region"
    >
      <ScreenReaderOnly>
        <OakHeading id="curriculum-downloads-heading" tag="h2">
          Download
        </OakHeading>
      </ScreenReaderOnly>
      {subjectTierSelectionVisible === true && (
        <OakDownloadsJourneyChildSubjectTierSelector
          tiers={tiers}
          childSubjects={childSubjects}
          getTierSubjectValues={handleTierSubjectSelection}
        />
      )}
      {!isLoading && subjectTierSelectionVisible === false && (
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
              {DOWNLOAD_TYPE_LABELS.filter(({ id }) =>
                availableDownloadTypes.includes(id),
              ).map((download) => (
                <Controller
                  key={download.id}
                  control={form.control}
                  name="resources"
                  defaultValue={[]}
                  render={({ field: { value: fieldValue, onChange } }) => {
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
                        formatSlot={download.subTitle}
                        iconName={download.icon}
                        onChange={onChangeHandler}
                      />
                    );
                  }}
                />
              ))}
            </OakFlex>
          }
          updatedAt=""
          showTermsAgreement={true}
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
          downloads={[]}
        />
      )}
    </OakBox>
  );
};

export default DownloadTab;
