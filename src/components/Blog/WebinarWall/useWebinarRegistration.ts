import { LS_KEY_PAST_WEBINARS_UNLOCKED } from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useWebinarRegistration = () => {
  const [webinarsUnlocked, setWebinarsUnlocked] = useLocalStorage(
    LS_KEY_PAST_WEBINARS_UNLOCKED,
    false
  );

  const onSubmit = () => {
    setWebinarsUnlocked(true);
  };

  return {
    onSubmit,
    webinarsUnlocked,
  };
};

export default useWebinarRegistration;
