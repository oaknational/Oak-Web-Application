import { useAuth } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";

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
  const authFlagEnabled =
    useFeatureFlagVariantKey("teacher-download-auth") === "with-login";

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

      await downloadLessonResources({
        lessonSlug: slug,
        selectedResourceTypes: downloads as DownloadResourceType[],
        isLegacyDownload: props.isLegacyDownload,
        authFlagEnabled,
        authToken: accessToken,
      });
    }
  };

  return { onSubmit };
};

export default useResourceFormSubmit;
