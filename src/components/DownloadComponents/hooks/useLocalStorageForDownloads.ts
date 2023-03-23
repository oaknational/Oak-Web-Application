import {
  LS_KEY_EMAIL,
  LS_KEY_SCHOOL_ID,
  LS_KEY_SCHOOL_NAME,
  LS_KEY_TERMS,
} from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useLocalStorageForDownloads = () => {
  const [emailFromLocalStorage, setEmailInLocalStorage] = useLocalStorage(
    LS_KEY_EMAIL,
    ""
  );

  const [schoolIdFromLocalStorage, setSchoolIdInLocalStorage] = useLocalStorage(
    LS_KEY_SCHOOL_ID,
    ""
  );

  const [schoolNameFromLocalStorage, setSchoolNameInLocalStorage] =
    useLocalStorage(LS_KEY_SCHOOL_NAME, "");

  const [termsFromLocalStorage, setTermsInLocalStorage] = useLocalStorage(
    LS_KEY_TERMS,
    false
  );

  return {
    schoolIdFromLocalStorage,
    setSchoolIdInLocalStorage,
    schoolNameFromLocalStorage,
    setSchoolNameInLocalStorage,
    emailFromLocalStorage,
    setEmailInLocalStorage,
    termsFromLocalStorage,
    setTermsInLocalStorage,
  };
};

export default useLocalStorageForDownloads;
