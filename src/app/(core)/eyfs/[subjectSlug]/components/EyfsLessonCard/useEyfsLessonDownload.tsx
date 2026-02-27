import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

export const useEyfsLessonDownload = ({
  lessonSlug,
  downloadableResources,
}: {
  lessonSlug: string;
  downloadableResources: ResourcesToDownloadArrayType;
}) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  const onDownload = async () => {
    try {
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
    } catch {
      // TODO: report error
      setCurrentToastProps({
        message:
          "Something went wrong with the download. Try refreshing the page.",
        variant: "error",
        showIcon: true,
        autoDismiss: true,
      });
    }
  };

  return {
    onDownload,
  };
};
