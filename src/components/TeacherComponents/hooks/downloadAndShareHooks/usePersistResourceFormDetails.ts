import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";

const usePersistResourceFormDetails = () => {
  const localStorage = useLocalStorageForDownloads();

  const persistResourceFormDetails = (data: ResourceFormValues) => {
    const {
      setEmailInLocalStorage,
      setSchoolInLocalStorage,
      setTermsInLocalStorage,
    } = localStorage;
    const email = data.email;
    const schoolId = data.school;
    const schoolName = data.schoolName;
    const terms = data.terms;

    if (email) {
      setEmailInLocalStorage(email);
    }

    if (schoolId) {
      if (schoolId === "homeschool" || schoolId === "notListed") {
        setSchoolInLocalStorage({
          schoolId,
          schoolName: schoolId,
        });
      } else if (schoolName) {
        setSchoolInLocalStorage({ schoolId, schoolName });
      }
    }

    if (terms) {
      setTermsInLocalStorage(terms);
    }
  };

  return { persistResourceFormDetails };
};

export default usePersistResourceFormDetails;
