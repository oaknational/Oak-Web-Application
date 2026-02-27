import errorReporter from "@/common-lib/error-reporter";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import OakError from "@/errors/OakError";

const reportError = errorReporter("EYFS lesson download");

export const useEyfsLessonDownload = ({
  lessonSlug,
  downloadableResources,
}: {
  lessonSlug: string;
  downloadableResources: ResourcesToDownloadArrayType;
}) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  const { schoolFromLocalStorage } = useLocalStorageForDownloads();

  const {
    schoolName: schoolNameFromLocalStorage,
    schoolId: schoolIdFromLocalStorage,
  } = schoolFromLocalStorage;

  const { onHubspotSubmit } = useHubspotSubmit();

  const onDownload = async () => {
    try {
      onHubspotSubmit({
        school: schoolIdFromLocalStorage,
        schoolName: schoolNameFromLocalStorage,
        resources: downloadableResources,
        terms: true,
      });
      await downloadLessonResources({
        lessonSlug: lessonSlug,
        selectedResourceTypes: downloadableResources,
        isLegacyDownload: true,
      });
      setCurrentToastProps({
        message: "Download successful",
        variant: "success",
        showIcon: true,
        autoDismiss: true,
      });
    } catch (err) {
      setCurrentToastProps({
        message:
          "Something went wrong with the download. Try refreshing the page.",
        variant: "error",
        showIcon: true,
        autoDismiss: true,
      });
      const error = new OakError({
        code: "downloads/failed-to-fetch",
        meta: { lessonSlug, err },
      });
      reportError(error);
    }
  };

  return {
    onDownload,
  };
};
