"use client";
import {
  OakBox,
  OakBreadcrumbs,
  OakHandDrawnHR,
  OakMaxWidth,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";

import { TeachWithOakResourceCards } from "./TeachWithOakResourceCards";

import { resolveOakHref } from "@/common-lib/urls";
import DownloadPageWithAccordion from "@/components/TeacherComponents/DownloadPageWithAccordion";
import downloadDebouncedSubmit from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadDebounceSubmit";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import useTeachWithOakDownload from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useTeachWithOakDownload";
import { useOnboardingStatus } from "@/components/TeacherComponents/hooks/useOnboardingStatus";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { TeachWithOakShortReadsDownloads } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/teachWithOakShortReads.schema";

export const TeachWithOakDownloadView = ({
  resources,
}: {
  resources: TeachWithOakShortReadsDownloads;
}) => {
  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
    hasFormErrors,
    localStorageDetails,
    handleToggleSelectAll,
    selectAllChecked,
    setEmailInLocalStorage,
    hubspotLoaded,
  } = useResourceFormState({
    type: "teach-with-oak",
  });

  const { onSubmit } = useTeachWithOakDownload();
  const { onHubspotSubmit } = useHubspotSubmit();
  const { setCurrentToastProps } = useOakNotificationsContext();
  const onboardingStatus = useOnboardingStatus();

  const onFormSubmit = async (data: ResourceFormValues): Promise<void> => {
    setApiError(null);
    await onHubspotSubmit(data);

    try {
      await downloadDebouncedSubmit({
        data,
        setIsAttemptingDownload,
        setEditDetailsClicked,
        onSubmit,
      });

      setIsDownloadSuccessful(true);

      if (editDetailsClicked && !data.email) {
        setEmailInLocalStorage("");
      }

      setCurrentToastProps({
        message: "Download started. This may take a few minutes",
        variant: "success",
        autoDismiss: true,
        showClose: true,
        showIcon: true,
      });

      // TD: Tracking
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

  let downloadButtonText = "Download .zip";
  if (isAttemptingDownload) {
    downloadButtonText = "Downloading...";
  } else if (!hubspotLoaded) {
    downloadButtonText = "Loading...";
  }

  return (
    <OakBox $ph={["spacing-16", "spacing-0"]} $background={"bg-neutral"}>
      <OakMaxWidth
        $pb="spacing-80"
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
      >
        <OakBox
          $mb={isDownloadSuccessful ? "spacing-0" : "spacing-32"}
          $mt={"spacing-24"}
        >
          <OakBreadcrumbs
            breadcrumbs={[
              {
                text: "Teach with Oak",
                href: resolveOakHref({ page: "teach-with-oak" }),
              },
              { text: "Download" },
            ]}
          />
          <OakHandDrawnHR
            hrColor={"text-subdued"}
            $height={"spacing-4"}
            $mt={"spacing-24"}
            $mb={"spacing-24"}
          />
        </OakBox>
        <DownloadPageWithAccordion
          teachWithOak
          heading="Download short read guides"
          errors={form.errors}
          handleToggleSelectAll={handleToggleSelectAll}
          selectAllChecked={selectAllChecked}
          showLoading={isLocalStorageLoading}
          email={emailFromLocalStorage}
          school={schoolNameFromLocalStorage}
          schoolId={schoolIdFromLocalStorage}
          setSchool={setSchool}
          withHomeschool
          showSavedDetails={shouldDisplayDetailsCompleted}
          onEditClick={handleEditDetailsCompletedClick}
          register={form.register}
          control={form.control}
          showPostAlbCopyright
          triggerForm={form.trigger}
          validationSummaryKey={form.submitCount}
          apiError={apiError}
          showTermsAgreement={
            onboardingStatus === "not-onboarded" ||
            onboardingStatus === "unknown"
          }
          cardGroup={<TeachWithOakResourceCards resources={resources} />}
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
                  (!form.formState.isValid && !localStorageDetails)) &&
                hubspotLoaded
              }
            >
              {downloadButtonText}
            </OakPrimaryButton>
          }
        />
      </OakMaxWidth>
    </OakBox>
  );
};
