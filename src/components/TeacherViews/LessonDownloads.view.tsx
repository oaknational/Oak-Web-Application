import { useMemo, useState } from "react";
import {
  examboards,
  tierDescriptions,
} from "@oaknational/oak-curriculum-schema";
import {
  OakBox,
  OakHandDrawnHR,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { getResourcesWithoutLegacyCopyright } from "../TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import { useOnboardingStatus } from "../TeacherComponents/hooks/useOnboardingStatus";
import Banners from "../SharedComponents/Banners";

import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  KeyStageTitleValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import useResourceFormSubmit from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
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
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import DownloadPageWithAccordion from "@/components/TeacherComponents/DownloadPageWithAccordion";
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
  LegacyCopyrightContent,
  Actions,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonDownloadRegionBlocked } from "@/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked";
import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

type BaseLessonDownload = {
  expired: boolean | null;
  isLegacy: boolean;
  lessonTitle: string;
  lessonSlug: string;
  lessonCohort?: string | null;
  downloads: LessonDownloadsPageData["downloads"];
  additionalFiles: LessonDownloadsPageData["additionalFiles"];
  legacyCopyrightContent?: LegacyCopyrightContent;
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

  const downloadsFiltered = useMemo(
    () =>
      getResourcesWithoutLegacyCopyright(
        downloads,
        legacyCopyrightContent,
      ).filter((r) => r.exists && !r.forbidden && r.inGcsBucket),
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
    hasResources,
    handleToggleSelectAll,
    selectAllChecked,
    setEmailInLocalStorage,
    hubspotLoaded,
  } = useResourceFormState({
    downloadResources: downloadsFiltered,
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
        school: data.school,
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
          (downloadsFiltered?.length ?? 0) + (additionalFiles?.length ?? 0),
      });
    } catch {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  const showNoResources =
    !hasResources || Boolean(expired) || downloadsFiltered.length === 0;

  return (
    <OakBox $ph={["spacing-16", "spacing-0"]} $background={"grey20"}>
      {isDownloadSuccessful && <Banners />}
      <OakMaxWidth
        $pb="spacing-80"
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
      >
        <OakBox
          $mb={isDownloadSuccessful ? "spacing-0" : "spacing-32"}
          $mt={"spacing-24"}
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
            $height={"spacing-4"}
            $mt={"spacing-24"}
            $mb={"spacing-24"}
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
        ) : isDownloadSuccessful ? (
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
            keyStageSlug={keyStageSlug === undefined ? null : keyStageSlug}
            keyStageTitle={
              keyStageTitle === undefined
                ? null
                : (keyStageTitle as KeyStageTitleValueType)
            }
            isLegacy={isLegacyDownload}
            lessonReleaseDate={lessonReleaseDate ?? "unreleased"}
          />
        ) : (
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
            apiError={apiError}
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
                  downloads={downloadsFiltered}
                  additionalFiles={additionalFiles}
                  hasError={Boolean(form.errors?.resources)}
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
            downloads={downloadsFiltered}
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
