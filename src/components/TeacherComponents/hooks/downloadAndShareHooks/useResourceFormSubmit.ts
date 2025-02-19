import { useAuth } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import type {
  DownloadResourceType,
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
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

  const onSubmit = async (
    data: ResourceFormProps | ResourceFormWithRiskAssessmentProps,
    slug: string,
  ) => {
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

      await downloadLessonResources(
        slug,
        downloads as DownloadResourceType[],
        props.isLegacyDownload,
        authFlagEnabled,
        accessToken,
      );
    }
  };

  return { onSubmit };
};

export default useResourceFormSubmit;
