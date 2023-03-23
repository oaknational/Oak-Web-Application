import type {
  DownloadFormProps,
  DownloadResourceType,
} from "../../../components/DownloadComponents/downloads.types";
import downloadLessonResources from "../helpers/downloadLessonResources";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

type UseDownloadFormProps = {
  onSubmit?: () => void;
};

const useDownloadForm = (props: UseDownloadFormProps = {}) => {
  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  const onSubmit = async (
    data: DownloadFormProps,
    slug: string,
    selectedResources: DownloadResourceType[]
  ) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const emailFromForm = data?.email;
    const schoolFromForm = data?.school;
    const termsFromForm = data?.terms;

    if (emailFromForm) {
      setEmailInLocalStorage(emailFromForm);
    }

    if (schoolFromForm) {
      setSchoolInLocalStorage(schoolFromForm);
    }

    if (termsFromForm) {
      setTermsInLocalStorage(termsFromForm);
    }

    await downloadLessonResources(slug, selectedResources);
  };

  return { onSubmit };
};

export default useDownloadForm;
