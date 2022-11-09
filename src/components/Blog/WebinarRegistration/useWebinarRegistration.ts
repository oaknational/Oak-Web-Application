import { useEffect, useState } from "react";

import { LS_KEY_PAST_WEBINARS_UNLOCKED } from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useWebinarRegistration = () => {
  const [webinarsUnlocked, setWebinarsUnlocked] = useLocalStorage(
    LS_KEY_PAST_WEBINARS_UNLOCKED,
    false
  );
  const [webinarLockState, setWebinarLockState] = useState<
    "pending" | "locked" | "unlocked"
  >("pending");

  useEffect(() => {
    if (webinarsUnlocked) {
      setWebinarLockState("unlocked");
    } else {
      setWebinarLockState("locked");
    }
  }, [webinarsUnlocked]);

  const onSubmit = () => {
    setWebinarsUnlocked(true);
  };

  return {
    webinarRegistrationProps: { onSubmit },
    webinarLockState,
    setWebinarsUnlocked,
  };
};

export default useWebinarRegistration;
