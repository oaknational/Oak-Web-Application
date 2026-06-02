import { useAuth } from "@clerk/nextjs";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import type {
  DownloadResourceType,
  ResourceFormValues,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";

export type OnSubmitProps = { data: ResourceFormValues } & (
  | { type: "download"; slug: string; isLegacyDownload: boolean }
  | { type: "share"; slug: string }
  | {
      type: "curriculum";
      mvRefreshTime: number;
      slugs: CurriculumSelectionSlugs;
      tierSlug: string | null;
      childSubjectSlug: string | null;
    }
);

const useResourceFormSubmit = () => {
  const localStorage = useLocalStorageForDownloads();
  const auth = useAuth();

  const onSubmit = async (onSubmitProps: OnSubmitProps) => {
    handleLocalStorageSync(onSubmitProps.data, localStorage);

    const { resources } = onSubmitProps.data;

    if (onSubmitProps.type === "download") {
      const downloads = resources;
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
            .map((d) =>
              Number.parseInt(d.split("additional-files-")?.[1] ?? ""),
            )
        : [];

      await downloadLessonResources({
        lessonSlug: onSubmitProps.slug,
        selectedResourceTypes: selectedResourceTypes as DownloadResourceType[],
        selectedAdditionalFilesIds,
        isLegacyDownload: onSubmitProps.isLegacyDownload,
        authToken: accessToken,
        openInANewTab: true,
      });
    } else if (onSubmitProps.type === "curriculum") {
      const { mvRefreshTime, slugs, tierSlug, childSubjectSlug } =
        onSubmitProps;
      const downloadPath = createCurriculumDownloadsUrl(
        resources,
        "published",
        mvRefreshTime,
        slugs.subjectSlug,
        slugs.phaseSlug,
        slugs.ks4OptionSlug,
        tierSlug,
        childSubjectSlug,
      );
      await downloadFileFromUrl(downloadPath);
    }
  };

  return { onSubmit };
};

const handleLocalStorageSync = (
  data: ResourceFormValues,
  localStorage: ReturnType<typeof useLocalStorageForDownloads>,
) => {
  const {
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
  } = localStorage;
  const email = data?.email;
  const schoolId = data?.school;
  const schoolName = data?.schoolName;
  const terms = data?.terms;

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
};

export default useResourceFormSubmit;
