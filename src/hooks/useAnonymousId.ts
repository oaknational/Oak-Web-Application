import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { LS_KEY_ANONYMOUS_ID } from "../config/localStorageKeys";

import useLocalStorage, { parseJSON } from "./useLocalStorage";

const OLD_ANONYMOUS_ID_KEY = "anonymousID";

const generateAnonymousId = () => {
  return uuidv4();
};

/**
 * If there is already an anonymous id (using the old key), then use that,
 * otherwise generate a new one.
 */
const initialValue = (() => {
  if (typeof window === "undefined") {
    return generateAnonymousId();
  }

  try {
    const item = window.localStorage.getItem(OLD_ANONYMOUS_ID_KEY);
    if (item) {
      const parsed = parseJSON(item);
      if (typeof parsed === "string") {
        return parsed;
      }
    }

    return generateAnonymousId();
  } catch (error) {
    console.warn(
      `Error reading localStorage key “${OLD_ANONYMOUS_ID_KEY}”:`,
      error
    );
    return generateAnonymousId();
  }
})();

const useAnonymousId = () => {
  const [anonymousId, setAnonymousId] = useLocalStorage(
    LS_KEY_ANONYMOUS_ID,
    initialValue
  );

  useEffect(() => {
    if (!anonymousId) {
      setAnonymousId(initialValue);
    }
  }, [anonymousId, setAnonymousId]);

  useEffect(() => {
    // Clean up old local storage key
    window.localStorage.removeItem(OLD_ANONYMOUS_ID_KEY);
  }, []);

  return anonymousId;
};

export default useAnonymousId;
