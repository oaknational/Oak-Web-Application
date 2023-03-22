import { LS_KEY_EMAIL, LS_KEY_SCHOOL } from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useLocalStorageForDownloads = () => {
  const [emailFromLocalStorage, setEmailInLocalStorage] = useLocalStorage(
    LS_KEY_EMAIL,
    ""
  );

  const [schoolFromLocalStorage, setSchoolInLocalStorage] = useLocalStorage(
    LS_KEY_SCHOOL,
    ""
  );

  return {
    schoolFromLocalStorage,
    setSchoolInLocalStorage,
    emailFromLocalStorage,
    setEmailInLocalStorage,
  };
};

export default useLocalStorageForDownloads;
