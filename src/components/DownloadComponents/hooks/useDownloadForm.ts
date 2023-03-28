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

    await downloadLessonResources(slug, selectedResources);
  };

  return { onSubmit };
};

export default useDownloadForm;
