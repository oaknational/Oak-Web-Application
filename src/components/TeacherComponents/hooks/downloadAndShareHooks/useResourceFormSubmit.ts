import { useAuth } from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import type {
  DownloadResourceType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";

type UseResourceFormProps = {
  onSubmit?: () => void;
} & ({ type: "share" } | { type: "download"; isLegacyDownload: boolean });

const useResourceFormSubmit = (props: UseResourceFormProps) => {
  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  const auth = useAuth();
  const authFlagEnabled = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );

  const onSubmit = async (data: ResourceFormProps, slug: string) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const email = data?.email;
    const schoolId = data?.school;
    const schoolName = data?.schoolName;
    const terms = data?.terms;
    const downloads = data?.resources;

    if (email) {
      setEmailInLocalStorage(email);
    }

    if (schoolId) {
      if (schoolId === "homeschool" || schoolId === "notListed") {
        setSchoolInLocalStorage({
          schoolId,
          schoolName: schoolId,
        });
      } else {
        if (schoolName && schoolId) {
          setSchoolInLocalStorage({ schoolId, schoolName });
        }
      }
    }
    if (terms) {
      setTermsInLocalStorage(terms);
    }
    if (props.type === "download") {
      const accessToken = await auth.getToken();

      const additionalFilesRegex = /additional-files-*/;
      const hasAdditionalFiles = downloads.some((d) =>
        additionalFilesRegex.test(d),
      );

      const selectedResourceTypes = hasAdditionalFiles
        ? downloads
            .filter((d) => !additionalFilesRegex.test(d))
            .concat(["additional-files"])
        : downloads;
      const selectedAdditionalFilesIds = hasAdditionalFiles
        ? downloads
            .filter((d) => additionalFilesRegex.test(d))
            .map((d) => parseInt(d.split("additional-files-")?.[1] ?? ""))
        : [];

      await downloadLessonResources({
        lessonSlug: slug,
        selectedResourceTypes: selectedResourceTypes as DownloadResourceType[],
        selectedAdditionalFilesIds,
        isLegacyDownload: props.isLegacyDownload,
        authRequired: authFlagEnabled,
        authToken: accessToken,
      });
    }
  };

  return { onSubmit };
};

export default useResourceFormSubmit;
