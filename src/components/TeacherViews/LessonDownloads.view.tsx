"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionsCamel } from "@oaknational/oak-curriculum-schema";
import {
  OakBox,
  OakHandDrawnHR,
  OakMaxWidth,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { getResourcesWithoutLegacyCopyright } from "../TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import { useOnboardingStatus } from "../TeacherComponents/hooks/useOnboardingStatus";
import Banners from "../SharedComponents/Banners";
import { waitForLinkCallback } from "../SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

import useLessonDownloadExistenceCheck from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck";
import useResourceFormSubmit from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit";
import {
  DownloadResourceType,
  ResourceFormValues,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import DownloadCardGroup from "@/components/TeacherComponents/DownloadCardGroup";
import debouncedSubmit from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadDebounceSubmit";
import {
  getLessonOverviewBreadCrumb,
  getLessonDownloadsBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import DownloadPageWithAccordion from "@/components/TeacherComponents/DownloadPageWithAccordion";
import {
  LessonDownloadsPageData,
  NextLesson,
} from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import type { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { LEGACY_COHORT } from "@/config/cohort";
import { LegacyCopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonDownloadRegionBlocked } from "@/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked";
import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

type BaseLessonDownload = {
  expired: boolean | null;
  isLegacy: boolean;
  lessonTitle: string;
  lessonSlug: string;
  lessonCohort?: string | null;
  downloads: LessonDownloadsPageData["downloads"];
  additionalFiles: LessonDownloadsPageData["additionalFiles"];
  legacyCopyrightContent?: LegacyCopyrightContent;
  developmentStageTitle?: string | null;
  geoRestricted: boolean | null;
  loginRequired: boolean | null;
  actions?: ActionsCamel | null;
  lessonReleaseDate: string | null;
};

type NonCanonicalLesson = BaseLessonDownload & {
  nextLessons: NextLesson[];
  updatedAt: string;
} & LessonPathway & {
    lessons?: LessonListSchema;
    unitDescription?: string | null;
    subjectCategories?: string[] | null;
  };

type LessonDownloadsProps = {
  lesson: NonCanonicalLesson;
  breadcrumbsSlot?: ReactNode;
  successRedirect?: string;
};

export function LessonDownloads(props: Readonly<LessonDownloadsProps>) {
  const { lesson } = props;
  const { setCurrentToastProps } = useOakNotificationsContext();
  const router = useRouter();
  const {
    lessonTitle,
    lessonSlug,
    downloads,
    additionalFiles,
    expired,
    isLegacy,
    legacyCopyrightContent,
    updatedAt,
    actions,
    lessonReleaseDate,
    loginRequired,
    geoRestricted,
  } = lesson;

  const {
    showGeoBlocked,
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showSignedInNotOnboarded,
  } = useComplexCopyright({
    loginRequired: loginRequired ?? false,
    geoRestricted: geoRestricted ?? false,
  });
  const downloadsRestricted =
    showSignedOutGeoRestricted ||
    showSignedOutLoginRequired ||
    showSignedInNotOnboarded;
  downloads.forEach((download) => {
    if (download.type === "presentation") {
      download.label = "Lesson slides";
      return download;
    }
  });

  const showRiskAssessmentBanner = actions?.isPePractical;

  const { programmeSlug, unitSlug, lessonCohort } = props.lesson;

  const { lessonResourcesDownloaded } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const isLegacyDownload = !lessonCohort || lessonCohort === LEGACY_COHORT;

  const onwardContent = lesson.nextLessons
    ? lesson.nextLessons?.map((nextLesson) => {
        return nextLesson.lessonSlug;
      })
    : [];

  const downloadsFilteredByCopyright = useMemo(
    () => getResourcesWithoutLegacyCopyright(downloads, legacyCopyrightContent),
    [downloads, legacyCopyrightContent],
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

  const { onSubmit } = useResourceFormSubmit();

  const { onHubspotSubmit } = useHubspotSubmit();

  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);

  let downloadButtonText = "Download .zip";
  if (isAttemptingDownload) {
    downloadButtonText = "Downloading...";
  } else if (!hubspotLoaded) {
    downloadButtonText = "Loading...";
  }

  const onFormSubmit = async (data: ResourceFormValues): Promise<void> => {
    setApiError(null);
    await onHubspotSubmit(data);

    try {
      await debouncedSubmit({
        data,
        slug: lessonSlug,
        setIsAttemptingDownload,
        setEditDetailsClicked,
        onSubmit,
        type: "download",
        isLegacyDownload,
      });

      if (props.successRedirect) {
        waitForLinkCallback(() => {
          setCurrentToastProps({
            message: "Download started. This may take a few minutes",
            variant: "success",
            autoDismiss: true,
            showClose: true,
            showIcon: true,
          });
          router.replace(props.successRedirect!);
        });
      } else {
        setIsDownloadSuccessful(true);
      }
      if (editDetailsClicked && !data.email) {
        setEmailInLocalStorage("");
      }

      lessonResourcesDownloaded({
        ...data,
        onwardContent,
        selectedResources,
        totalDownloadableResources:
          (downloadsFilteredByCopyright?.length ?? 0) +
          (additionalFiles?.length ?? 0),
      });
    } catch {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
      setCurrentToastProps({
        message:
          "Something went wrong with the download. Try refreshing the page.",
        variant: "error",
        autoDismiss: false,
        showIcon: true,
      });
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
    <OakBox $ph={["spacing-16", "spacing-0"]} $background={"bg-neutral"}>
      {isDownloadSuccessful && <Banners />}
      <OakMaxWidth
        $pb="spacing-80"
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
      >
        <OakBox
          $mb={isDownloadSuccessful ? "spacing-0" : "spacing-32"}
          $mt={"spacing-24"}
        >
          {props.breadcrumbsSlot ? (
            props.breadcrumbsSlot
          ) : (
            // TD: remove legacy breadcrumbs once the integrated journey is fully rolled out.
            <Breadcrumbs
              breadcrumbs={[
                ...getBreadcrumbsForLessonPathway(getCommonPathway([lesson])),
                getLessonOverviewBreadCrumb({
                  lessonTitle,
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  isCanonical: false,
                }),
                getLessonDownloadsBreadCrumb({
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  disabled: true,
                }),
              ]}
            />
          )}
          <OakHandDrawnHR
            hrColor={"text-subdued"}
            $height={"spacing-4"}
            $mt={"spacing-24"}
            $mb={"spacing-24"}
          />
        </OakBox>
        {showGeoBlocked && (
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
        )}
        {!showGeoBlocked && !isDownloadSuccessful && (
          <DownloadPageWithAccordion
            loginRequired={loginRequired ?? false}
            geoRestricted={geoRestricted ?? false}
            downloadsRestricted={downloadsRestricted}
            errors={form.errors}
            handleToggleSelectAll={handleToggleSelectAll}
            selectAllChecked={selectAllChecked}
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
            triggerForm={form.trigger}
            validationSummaryKey={form.submitCount}
            apiError={apiError}
            copyrightYear={updatedAt}
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
                  hasError={Boolean(form.errors?.resources)}
                  triggerForm={form.trigger}
                />
              )
            }
            cta={
              <OakPrimaryButton
                type="button"
                onClick={(event) => void form.handleSubmit(onFormSubmit)(event)} // https://github.com/orgs/react-hook-form/discussions/8622}
                iconName={"download"}
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
              >
                {downloadButtonText}
              </OakPrimaryButton>
            }
            showRiskAssessmentBanner={showRiskAssessmentBanner}
            lessonDownloads={downloadsFilteredByCopyright}
            additionalFiles={additionalFiles}
            showGeoBlocked={showGeoBlocked}
            lessonSlug={lessonSlug}
            lessonTitle={lessonTitle}
            lessonReleaseDate={lessonReleaseDate}
            isLegacy={isLegacy}
          />
        )}
      </OakMaxWidth>
    </OakBox>
  );
}
