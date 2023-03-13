import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { LS_KEY_ANONYMOUS_ID } from "../../config/localStorageKeys";
import { parseJSON } from "../../hooks/useLocalStorage";

export const OLD_ANONYMOUS_ID_KEY = "anonymousID";
export type AnonymousUserId = string;
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
export default function getOrGenerateAnonymousId(): AnonymousUserId {
  if (typeof window === "undefined") {
    return generateAnonymousId();
  }

  try {
    // first attempt get from cookie
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
    // else attempt get from local storage (new key)
    const newValue = window.localStorage.getItem(LS_KEY_ANONYMOUS_ID);
    if (newValue) {
      const parsed = parseJSON(newValue);
      if (typeof parsed === "string") {
        return parsed;
      }
    }
    // else attempt get from local storage (old key)
    const oldValue = window.localStorage.getItem(OLD_ANONYMOUS_ID_KEY);
    if (oldValue) {
      const parsed = parseJSON(oldValue);
      if (typeof parsed === "string") {
        return parsed;
      }
    }
    // else generate new
    return generateAnonymousId();
  } catch (error) {
    console.warn(
      `Error reading localStorage key “${OLD_ANONYMOUS_ID_KEY}”:`,
      error
    );
    return generateAnonymousId();
  }
}
