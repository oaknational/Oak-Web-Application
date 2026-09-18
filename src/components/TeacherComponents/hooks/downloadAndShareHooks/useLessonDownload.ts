import { useAuth } from "@clerk/nextjs";

import usePersistResourceFormDetails from "./usePersistResourceFormDetails";

import type {
  DownloadResourceType,
  ResourceFormValues,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

export type LessonDownloadProps = {
  data: ResourceFormValues;
  slug: string;
  isLegacyDownload: boolean;
};

const useLessonDownload = () => {
  const auth = useAuth();
  const { persistResourceFormDetails } = usePersistResourceFormDetails();

  const onSubmit = async ({
    data,
    slug,
    isLegacyDownload,
  }: LessonDownloadProps) => {
    persistResourceFormDetails(data);
    const downloads = data.resources;
    const accessToken = await auth.getToken();
    const additionalFilesRegex = /additional-files-*/;
    const hasAdditionalFiles = downloads.some((download) =>
      additionalFilesRegex.test(download),
    );
    const selectedResourceTypes = hasAdditionalFiles
      ? downloads
          .filter((download) => !additionalFilesRegex.test(download))
          .concat(["additional-files"])
      : downloads;
    const selectedAdditionalFilesIds = hasAdditionalFiles
      ? downloads
          .filter((download) => additionalFilesRegex.test(download))
          .map((download) =>
            Number.parseInt(download.split("additional-files-")?.[1] ?? ""),
          )
      : [];

    await downloadLessonResources({
      lessonSlug: slug,
      selectedResourceTypes: selectedResourceTypes as DownloadResourceType[],
      selectedAdditionalFilesIds,
      isLegacyDownload,
      authToken: accessToken,
    });
  };

  return { onSubmit };
};

export default useLessonDownload;
