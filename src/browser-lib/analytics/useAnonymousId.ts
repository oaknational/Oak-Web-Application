import Cookies from "js-cookie";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { LS_KEY_ANONYMOUS_ID } from "../../config/localStorageKeys";
import useAnalytics from "../../context/Analytics/useAnalytics";
import useLocalStorage, { parseJSON } from "../../hooks/useLocalStorage";
import cookieOptions from "../cookie-consent/confirmic/cookieOptions";

const OLD_ANONYMOUS_ID_KEY = "anonymousID";

type AnonymousUserId = string;
const generateAnonymousId = (): AnonymousUserId => {
  return uuidv4();
};

/**
 * In order for sessions to persist from the Acorn apps, this hook checks
 * cookies for an anonymous id. If none is found it checks local storage
 * using the old key.
 *
 * If an anonymous id is found we store that using the new key, otherwise we
 * generate a new one, and store it in local storage.
 */
const getOrGenerateAnonymousId = (): AnonymousUserId => {
  if (typeof window === "undefined") {
    return generateAnonymousId();
  }

  try {
    const oakData = Cookies.get("oakData");

    if (oakData) {
      const parsedJSON = parseJSON(oakData);

      if (parsedJSON) {
        try {
          return z.object({ userId: z.string() }).parse(parsedJSON).userId;
        } catch (error) {
          // oakData malformed, continue to localStorage
        }
      }
    }
    const newValue = window.localStorage.getItem(LS_KEY_ANONYMOUS_ID);
    if (newValue) {
      const parsed = parseJSON(newValue);
      if (typeof parsed === "string") {
        return parsed;
      }
    }
    const oldValue = window.localStorage.getItem(OLD_ANONYMOUS_ID_KEY);
    if (oldValue) {
      const parsed = parseJSON(oldValue);
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
};

/**
 * If there is no `oakData` cookie present, set cookie containing userId.
 * This is to keep userId (aka anonymous id) consistent between legacy and beta
 * applications.
 * @todo remove this and unset cookie as part of legacy apps decommissioned
 */
const setLegacyCookieIfNotPresent = ({
  anonymousId,
}: {
  anonymousId: string;
}) => {
  const oakDataCookie = Cookies.get("oakData");
  if (!oakDataCookie) {
    Cookies.set(
      "oakData",
      JSON.stringify({ userId: anonymousId }),
      /**
       * Using assertion as cookieOptions are typed originally as CookieSetOptions
       * from "universal-cookie". These are basically identical, but subtly different.
       * Choosing to assert here rather than elsewhere since this code has an
       * assumed short lifetime.
       */
      cookieOptions as Cookies.CookieAttributes
    );
  }
};

const initialValue = getOrGenerateAnonymousId();

const useAnonymousId = (): AnonymousUserId => {
  const { identify } = useAnalytics();
  const [anonymousId, setAnonymousId] = useLocalStorage(
    LS_KEY_ANONYMOUS_ID,
    initialValue
  );

  useEffect(() => {
    if (anonymousId) {
      setAnonymousId(initialValue);
      setLegacyCookieIfNotPresent({ anonymousId });
      identify(anonymousId, {}, ["posthog"]);
    }
  }, [anonymousId, setAnonymousId, identify]);

  useEffect(() => {
    // Clean up old local storage key
    window.localStorage.removeItem(OLD_ANONYMOUS_ID_KEY);
  }, []);

  return anonymousId;
};

export default useAnonymousId;
export type { AnonymousUserId };
