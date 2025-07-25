import { useMemo, useState } from "react";
import {
  examboards,
  tierDescriptions,
} from "@oaknational/oak-curriculum-schema";
import { OakBox, OakHandDrawnHR } from "@oaknational/oak-components";

import { filterDownloadsByCopyright } from "../TeacherComponents/helpers/downloadAndShareHelpers/downloadsCopyright";
import { useOnboardingStatus } from "../TeacherComponents/hooks/useOnboardingStatus";

import MaxWidth from "@/components/SharedComponents/MaxWidth";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  KeyStageTitleValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import useLessonDownloadExistenceCheck from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck";
import useResourceFormSubmit from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit";
import {
  ResourceFormProps,
  DownloadResourceType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import DownloadCardGroup from "@/components/TeacherComponents/DownloadCardGroup";
import debouncedSubmit from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadDebounceSubmit";
import {
  getLessonOverviewBreadCrumb,
  getLessonDownloadsBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getBreadcrumbsForSpecialistLessonPathway,
  getBreadCrumbForSpecialistDownload,
  lessonIsSpecialist,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonPathway,
  SpecialistLessonPathway,
} from "@/components/TeacherComponents/types/lesson.types";
import ResourcePageLayout from "@/components/TeacherComponents/ResourcePageLayout";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import DownloadConfirmation from "@/components/TeacherComponents/DownloadConfirmation";
import {
  LessonDownloadsPageData,
  NextLesson,
} from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { LEGACY_COHORT } from "@/config/cohort";
import { SpecialistLessonDownloads } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";
import {
  CopyrightContent,
  Actions,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonDownloadRegionBlocked } from "@/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked";
import CopyrightRestrictionBanner from "@/components/TeacherComponents/CopyrightRestrictionBanner/CopyrightRestrictionBanner";
import { resolveOakHref } from "@/common-lib/urls";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

type BaseLessonDownload = {
  expired: boolean | null;
  isLegacy: boolean;
  lessonTitle: string;
  lessonSlug: string;
  lessonCohort?: string | null;
  downloads: LessonDownloadsPageData["downloads"];
  additionalFiles: LessonDownloadsPageData["additionalFiles"];
  copyrightContent?: CopyrightContent;
  isSpecialist: false;
  developmentStageTitle?: string | null;
  geoRestricted: boolean | null;
  loginRequired: boolean | null;
  actions?: Actions | null;
  lessonReleaseDate: string | null;
};

type CanonicalLesson = BaseLessonDownload & {
  pathways: LessonPathway[];
  updatedAt: string;
  nextLessons?: NextLesson[];
};

type NonCanonicalLesson = BaseLessonDownload & {
  nextLessons: NextLesson[];
  updatedAt: string;
} & LessonPathway;

type SpecialistLesson = SpecialistLessonDownloads["lesson"];

type LessonDownloadsProps =
  | {
      isCanonical: true;
      lesson: CanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: NonCanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: SpecialistLesson;
    };

export function LessonDownloads(props: LessonDownloadsProps) {
  const { isCanonical, lesson } = props;
  const {
    lessonTitle,
    lessonSlug,
    downloads,
    additionalFiles,
    expired,
    isSpecialist,
    isLegacy,
    copyrightContent,
    updatedAt,
    actions,
    lessonReleaseDate,
    loginRequired,
    geoRestricted,
  } = lesson;

  const {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showGeoBlocked,
  } = useCopyrightRequirements({
    loginRequired: loginRequired ?? false,
    geoRestricted: geoRestricted ?? false,
  });

  const downloadsRestricted =
    showSignedOutLoginRequired || showSignedOutGeoRestricted;

  downloads.forEach((download) => {
    if (download.type === "presentation") {
      download.label = "Lesson slides";
      return download;
    }
  });

  const showRiskAssessmentBanner = !!actions?.isPePractical;

  const commonPathway =
    lessonIsSpecialist(lesson) && !props.isCanonical
      ? {
          lessonSlug,
          lessonTitle,
          unitSlug: props.lesson.unitSlug,
          programmeSlug: props.lesson.programmeSlug,
          unitTitle: props.lesson.unitTitle,
          subjectTitle: props.lesson.subjectTitle,
          subjectSlug: props.lesson.subjectSlug,
          developmentStageTitle: props.lesson.developmentStageTitle,
          disabled: false,
          lessonCohort: LEGACY_COHORT,
          keyStageSlug: null,
          keyStageTitle: null,
          pathwayTitle: null,
        }
      : getCommonPathway(
          props.isCanonical ? props.lesson.pathways : [props.lesson],
        );

  const {
    programmeSlug,
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
    lessonCohort,
    pathwayTitle,
  } = commonPathway;
  const { track } = useAnalytics();
  const isLegacyDownload = !lessonCohort || lessonCohort === LEGACY_COHORT;

  const onwardContent = lesson.nextLessons
    ? lesson.nextLessons?.map((nextLesson) => {
        return nextLesson.lessonSlug;
      })
    : [];

  const { onwardContentSelected } = track;

  const downloadsFilteredByCopyright = useMemo(
    () => filterDownloadsByCopyright(downloads, copyrightContent),
    [downloads, copyrightContent],
  );

  const {
    form,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    isLocalStorageLoading,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    setEditDetailsClicked,
    editDetailsClicked,
    selectedResources,
    hasFormErrors,
    localStorageDetails,
    activeResources,
    setActiveResources,
    hasResources,
    handleToggleSelectAll,
    selectAllChecked,
    setEmailInLocalStorage,
    hubspotLoaded,
  } = useResourceFormState({
    downloadResources: downloadsFilteredByCopyright,
    additionalFilesResources: additionalFiles,
    type: "download",
  });

  const onboardingStatus = useOnboardingStatus();

  const noResourcesSelected =
    form.watch().resources === undefined || form.watch().resources.length === 0;

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const { onSubmit } = useResourceFormSubmit({
    type: "download",
    isLegacyDownload,
  });

  const { onHubspotSubmit } = useHubspotSubmit();

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
    await onHubspotSubmit(data);

    try {
      await debouncedSubmit({
        data,
        lessonSlug,
        setIsAttemptingDownload,
        setEditDetailsClicked,
        onSubmit,
      });

      setIsDownloadSuccessful(true);
      if (editDetailsClicked && !data.email) {
        setEmailInLocalStorage("");
      }

      const {
        schoolOption,
        schoolName,
        schoolUrn,
        selectedResourcesForTracking,
      } = getFormattedDetailsForTracking({
        school: schoolIdFromLocalStorage,
        selectedResources,
      });

      const examboard = examboards.safeParse(
        (commonPathway as LessonPathway).examBoardTitle,
      );
      const tier = tierDescriptions.safeParse(
        (commonPathway as LessonPathway).tierTitle,
      );
      track.lessonResourcesDownloaded({
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        keyStageSlug,
        unitName: unitTitle,
        unitSlug,
        subjectTitle,
        subjectSlug,
        lessonName: lessonTitle,
        lessonSlug,
        resourceType: selectedResourcesForTracking,
        schoolUrn,
        schoolName,
        schoolOption,
        onwardContent,
        emailSupplied: data?.email ? true : false,
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        analyticsUseCase: "Teacher",
        eventVersion: "2.0.0",
        examBoard: examboard.success ? examboard.data : null,
        tierName: tier.success ? tier.data : null,
        componentType: "lesson_download_button",
        pathway: pathwayTitle as PathwayValueType,
        lessonReleaseCohort: isLegacyDownload ? "2020-2023" : "2023-2026",
        lessonReleaseDate: lessonReleaseDate ?? "unreleased",
        totalDownloadableResources:
          (downloadsFilteredByCopyright?.length ?? 0) +
          (additionalFiles?.length ?? 0),
      });
    } catch (error) {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  useLessonDownloadExistenceCheck({
    lessonSlug,
    resourcesToCheck: activeResources as DownloadResourceType[],
    additionalFilesIdsToCheck: null, // replace later with data
    onComplete: setActiveResources,
    isLegacyDownload: isLegacyDownload,
  });

  const showNoResources =
    !hasResources ||
    Boolean(expired) ||
    downloadsFilteredByCopyright.length === 0;

  return (
    <OakBox
      $ph={["inner-padding-m", "inner-padding-none"]}
      $background={"grey20"}
    >
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <OakBox
          $mb={isDownloadSuccessful ? "space-between-none" : "space-between-m2"}
          $mt={"space-between-m"}
        >
          <Breadcrumbs
            breadcrumbs={
              !isSpecialist
                ? [
                    ...getBreadcrumbsForLessonPathway(commonPathway),
                    getLessonOverviewBreadCrumb({
                      lessonTitle,
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      isCanonical,
                    }),
                    getLessonDownloadsBreadCrumb({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
                : [
                    ...getBreadcrumbsForSpecialistLessonPathway(
                      commonPathway as SpecialistLessonPathway,
                    ),
                    ...getBreadCrumbForSpecialistDownload({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
            }
          />
          <OakHandDrawnHR
            hrColor={"grey60"}
            $height={"all-spacing-1"}
            $mt={"space-between-m"}
            $mb={"space-between-m"}
          />
        </OakBox>
        {showGeoBlocked ? (
          <LessonDownloadRegionBlocked
            lessonName={lessonTitle}
            lessonSlug={lessonSlug}
            lessonReleaseDate={lessonReleaseDate ?? "unreleased"}
            isLegacy={isLegacy}
            href={resolveOakHref({
              page: "lesson-overview",
              lessonSlug,
              programmeSlug: programmeSlug!,
              unitSlug: unitSlug!,
            })}
          />
        ) : (
          (() => {
            if (isDownloadSuccessful) {
              return (
                <DownloadConfirmation
                  lessonSlug={lessonSlug}
                  lessonTitle={lessonTitle}
                  unitSlug={unitSlug}
                  unitTitle={unitTitle}
                  programmeSlug={programmeSlug}
                  data-testid="downloads-confirmation"
                  isCanonical={props.isCanonical}
                  nextLessons={lesson.nextLessons}
                  onwardContentSelected={(props) => {
                    onwardContentSelected({
                      ...props,
                      lessonReleaseCohort: isLegacyDownload
                        ? "2020-2023"
                        : "2023-2026",
                      lessonReleaseDate: lessonReleaseDate ?? "unreleased",
                    });
                  }}
                  isSpecialist={isSpecialist}
                  subjectSlug={subjectSlug}
                  subjectTitle={subjectTitle}
                  keyStageSlug={
                    keyStageSlug === undefined ? null : keyStageSlug
                  }
                  keyStageTitle={
                    keyStageTitle === undefined
                      ? null
                      : (keyStageTitle as KeyStageTitleValueType)
                  }
                  isLegacy={isLegacyDownload}
                  lessonReleaseDate={lessonReleaseDate ?? "unreleased"}
                />
              );
            }

            return (
              <ResourcePageLayout
                downloadsRestricted={downloadsRestricted ?? false}
                page={"download"}
                errors={form.errors}
                handleToggleSelectAll={handleToggleSelectAll}
                selectAllChecked={selectAllChecked}
                header="Download"
                showNoResources={showNoResources}
                showLoading={isLocalStorageLoading}
                email={emailFromLocalStorage}
                school={schoolNameFromLocalStorage}
                schoolId={schoolIdFromLocalStorage}
                setSchool={setSchool}
                showSavedDetails={shouldDisplayDetailsCompleted}
                onEditClick={handleEditDetailsCompletedClick}
                register={form.register}
                control={form.control}
                showPostAlbCopyright={!isLegacyDownload}
                resourcesHeader="Lesson resources"
                triggerForm={form.trigger}
                apiError={apiError}
                hideSelectAll={Boolean(expired)}
                updatedAt={updatedAt}
                withHomeschool={true}
                showTermsAgreement={
                  onboardingStatus === "not-onboarded" ||
                  onboardingStatus === "unknown"
                }
                isLoading={onboardingStatus === "loading"}
                cardGroup={
                  !showNoResources && (
                    <DownloadCardGroup
                      control={form.control}
                      downloads={downloadsFilteredByCopyright}
                      additionalFiles={additionalFiles}
                      hasError={form.errors?.resources ? true : false}
                      triggerForm={form.trigger}
                    />
                  )
                }
                cta={
                  <LoadingButton
                    type="button"
                    onClick={
                      (event) => void form.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
                    }
                    text={"Download .zip"}
                    icon={"download"}
                    isLoading={
                      isAttemptingDownload || !hubspotLoaded // show loading state when waiting for latest school values to be populated from hubspot
                    }
                    disabled={
                      (hasFormErrors ||
                        noResourcesSelected ||
                        showNoResources ||
                        (!form.formState.isValid && !localStorageDetails)) &&
                      hubspotLoaded
                    }
                    loadingText={
                      isAttemptingDownload ? "Downloading..." : "Loading..."
                    }
                  />
                }
                showRiskAssessmentBanner={showRiskAssessmentBanner}
              />
            );
          })()
        )}
        <OakBox $mt={"space-between-xl"}>
          {/* This page has its own geoblocked message, so we're hiding the banner in that case */}
          {!showGeoBlocked && (
            <CopyrightRestrictionBanner
              isGeorestricted={geoRestricted ?? undefined}
              isLoginRequired={loginRequired ?? undefined}
              componentType="lesson_downloads"
              lessonName={lessonTitle}
              lessonSlug={lessonSlug}
              lessonReleaseDate={lessonReleaseDate}
              isLessonLegacy={isLegacy}
            />
          )}
        </OakBox>
      </MaxWidth>
    </OakBox>
  );
}
