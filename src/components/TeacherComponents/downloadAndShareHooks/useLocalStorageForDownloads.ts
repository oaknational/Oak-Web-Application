import {
  LS_KEY_EMAIL,
  LS_KEY_SCHOOL,
  LS_KEY_TERMS,
} from "@/config/localStorageKeys";
import useLocalStorage from "@/hooks/useLocalStorage";

const useLocalStorageForDownloads = () => {
  const [emailFromLocalStorage, setEmailInLocalStorage] = useLocalStorage(
    LS_KEY_EMAIL,
    "",
  );

  const [schoolFromLocalStorage, setSchoolInLocalStorage] = useLocalStorage(
    LS_KEY_SCHOOL,
    {
      schoolId: "",
      schoolName: "",
    },
  );

  const [termsFromLocalStorage, setTermsInLocalStorage] = useLocalStorage(
    LS_KEY_TERMS,
    false,
  );

  const hasDetailsFromLocalStorage =
    (schoolFromLocalStorage.schoolId.length || emailFromLocalStorage.length) &&
    termsFromLocalStorage;

  return {
    schoolFromLocalStorage,
    setSchoolInLocalStorage,
    emailFromLocalStorage,
    setEmailInLocalStorage,
    termsFromLocalStorage,
    setTermsInLocalStorage,
    hasDetailsFromLocalStorage,
  };
};

export default useLocalStorageForDownloads;
