import { LS_KEY_EMAIL, LS_KEY_SCHOOL } from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useLocalStorageForDownloads = () => {
  const [emailFromLocaleStorage, setEmailInLocaleStorage] = useLocalStorage(
    LS_KEY_EMAIL,
    ""
  );

  const [schoolFromLocaleStorage, setSchoolInLocaleStorage] = useLocalStorage(
    LS_KEY_SCHOOL,
    ""
  );

  return {
    schoolFromLocaleStorage,
    setSchoolInLocaleStorage,
    emailFromLocaleStorage,
    setEmailInLocaleStorage,
  };
};

export default useLocalStorageForDownloads;
