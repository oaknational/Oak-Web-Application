import { useState } from "react";

import Box from "@/components/SharedComponents/Box";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Hr } from "@/components/SharedComponents/Typography";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { type LessonDownloadsData } from "@/node-lib/curriculum-api";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "@/components/DownloadAndShareComponents/helpers/getFormattedDetailsForTracking";
import useDownloadExistenceCheck from "@/components/DownloadAndShareComponents/hooks/useDownloadExistenceCheck";
import useResourceFormSubmit from "@/components/DownloadAndShareComponents/hooks/useResourceFormSubmit";
import {
  ResourceFormProps,
  DownloadResourceType,
} from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import DownloadCardGroup from "@/components/TeacherComponents/DownloadCardGroup";
import debouncedSubmit from "@/components/DownloadAndShareComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import {
  getLessonOverviewBreadCrumb,
  getLessonDownloadsBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
} from "@/components/TeacherComponents/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/lesson.types";
import ResourcePageLayout from "@/components/TeacherComponents/ResourcePageLayout";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import DownloadConfirmation from "@/components/DownloadAndShareComponents/DownloadConfirmation";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { useResourceFormState } from "@/components/DownloadAndShareComponents/hooks/useResourceFormState";
import { useHubspotSubmit } from "@/components/DownloadAndShareComponents/hooks/useHubspotSubmit";

type LessonDownloadsProps =
  | {
      isCanonical: true;
      lesson: {
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        downloads: LessonDownloadsData["downloads"];
        pathways: LessonPathway[];
        nextLessons?: NextLesson[];
      };
    }
  | {
      isCanonical: false;
      lesson: LessonPathway & {
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        downloads: LessonDownloadsData["downloads"];
        nextLessons: NextLesson[];
      };
    };

export function LessonDownloads(props: LessonDownloadsProps) {
  const { lesson } = props;
  const { lessonTitle, lessonSlug, downloads, isLegacy } = lesson;
  const commonPathway = getCommonPathway(
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
  } = commonPathway;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const isLegacyDownload = isLegacy;

  const onwardContent = lesson.nextLessons
    ? lesson.nextLessons?.map((nextLesson) => {
        return nextLesson.lessonSlug;
      })
    : [];

  const { onwardContentSelected } = track;

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
  } = useResourceFormState({ downloadResources: downloads, type: "download" });

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const { onSubmit } = useResourceFormSubmit({
    isLegacyDownload: isLegacyDownload,
    type: "download",
  });

  const { onHubspotSubmit } = useHubspotSubmit();

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
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
        analyticsUseCase,
        schoolUrn,
        schoolName,
        schoolOption,
        onwardContent,
        emailSupplied: data?.email ? true : false,
      });

      onHubspotSubmit(data);
    } catch (error) {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  useDownloadExistenceCheck({
    lessonSlug,
    resourcesToCheck: activeResources as DownloadResourceType[],
    onComplete: setActiveResources,
    isLegacyDownload: isLegacy,
  });

  return (
    <Box $ph={[16, null]} $background={"grey20"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <Box $mb={isDownloadSuccessful ? 0 : 32} $mt={24}>
          <Breadcrumbs
            breadcrumbs={[
              ...getBreadcrumbsForLessonPathway(commonPathway),
              getLessonOverviewBreadCrumb({
                lessonTitle,
                lessonSlug,
                programmeSlug,
                unitSlug,
              }),
              getLessonDownloadsBreadCrumb({
                lessonSlug,
                programmeSlug,
                unitSlug,
                disabled: true,
              }),
            ]}
          />
          <Hr $color={"grey60"} $mt={24} />
        </Box>

        <Box $display={isDownloadSuccessful ? "block" : "none"}>
          <DownloadConfirmation
            lessonSlug={lessonSlug}
            lessonTitle={lessonTitle}
            unitSlug={unitSlug}
            unitTitle={unitTitle}
            programmeSlug={programmeSlug}
            data-testid="downloads-confirmation"
            isCanonical={props.isCanonical}
            nextLessons={lesson.nextLessons}
            onwardContentSelected={onwardContentSelected}
          />
        </Box>
        {!isDownloadSuccessful && (
          <ResourcePageLayout
            page={"download"}
            errors={form.errors}
            handleToggleSelectAll={handleToggleSelectAll}
            selectAllChecked={selectAllChecked}
            header="Download"
            showNoResources={!hasResources}
            showLoading={isLocalStorageLoading}
            email={emailFromLocalStorage}
            school={schoolNameFromLocalStorage}
            schoolId={schoolIdFromLocalStorage}
            setSchool={setSchool}
            showSavedDetails={shouldDisplayDetailsCompleted}
            onEditClick={handleEditDetailsCompletedClick}
            register={form.register}
            control={form.control}
            showPostAlbCopyright={!isLegacy}
            resourcesHeader="Lesson resources"
            triggerForm={form.trigger}
            apiError={apiError}
            cardGroup={
              <DownloadCardGroup
                control={form.control}
                downloads={downloads}
                hasError={form.errors?.resources ? true : false}
                triggerForm={form.trigger}
              />
            }
            cta={
              <LoadingButton
                type="button"
                onClick={
                  (event) => void form.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
                }
                text={"Download .zip"}
                icon={"download"}
                isLoading={isAttemptingDownload}
                disabled={
                  hasFormErrors ||
                  (!form.formState.isValid && !localStorageDetails)
                }
                loadingText={"Downloading..."}
              />
            }
          />
        )}
      </MaxWidth>
    </Box>
  );
}
