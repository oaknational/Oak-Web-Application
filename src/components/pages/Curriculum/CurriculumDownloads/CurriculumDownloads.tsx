import { useState } from "react";

import Box from "@/components/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import getFormattedDetailsForTracking from "@/components/DownloadAndShareComponents/helpers/getFormattedDetailsForTracking";
import useResourceFormSubmit from "@/components/DownloadAndShareComponents/hooks/useResourceFormSubmit";
import { ResourceFormProps } from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import DownloadCardGroup from "@/components/DownloadAndShareComponents/DownloadCardGroup/DownloadCardGroup";
import debouncedSubmit from "@/components/DownloadAndShareComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import ResourcePageLayout from "@/components/DownloadAndShareComponents/ResourcePageLayout";
import LoadingButton from "@/components/Button/LoadingButton";
import { useResourceFormState } from "@/components/DownloadAndShareComponents/hooks/useResourceFormState";

type CurriculumDownloadsProps = {
  category: string;
  downloads: {
    exists: true;
    type: "curriculum-pdf";
    label: string;
    ext: "pdf";
  }[];
};

export function CurriculumDownloads(props: CurriculumDownloadsProps) {
  const { category, downloads } = props;
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

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
  } = useResourceFormState({ downloadResources: downloads, type: "download" });

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const { onSubmit } = useResourceFormSubmit({
    isLegacyDownload: true,
    type: "download",
  });

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
    try {
      await debouncedSubmit({
        data,
        lessonSlug: "",
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

      track.curriculumResourcesDownloaded({
        category: "KS3", // TODO: replace with "keyStage" once we have the correct value
        subject: "Subject", // TODO: replace with "subject" once we have the correct value
        resourceType: selectedResourcesForTracking,
        analyticsUseCase,
        schoolUrn,
        schoolName,
        schoolOption,
        emailSupplied: data?.email ? true : false,
      });
    } catch (error) {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  return (
    <Box $pt={32}>
      <Box $maxWidth={1280} $mh={"auto"} $width={"100%"} $ph={28} $pb={80}>
        <Box $display={isDownloadSuccessful ? "block" : "none"}>
          Download successful!
        </Box>
        {!isDownloadSuccessful && (
          <ResourcePageLayout
            page={"download"}
            errors={form.errors}
            handleToggleSelectAll={handleToggleSelectAll}
            selectAllChecked={selectAllChecked}
            header={category}
            showNoResources={!hasResources}
            showLoading={isLocalStorageLoading}
            hideSelectAll={true}
            email={emailFromLocalStorage}
            school={schoolNameFromLocalStorage}
            schoolId={schoolIdFromLocalStorage}
            setSchool={setSchool}
            showSavedDetails={shouldDisplayDetailsCompleted}
            onEditClick={handleEditDetailsCompletedClick}
            register={form.register}
            control={form.control}
            // TODO: confirm which copyright to use
            showPostAlbCopyright={true}
            resourcesHeader="Choose your downloads"
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
      </Box>
    </Box>
  );
}

export default CurriculumDownloads;
