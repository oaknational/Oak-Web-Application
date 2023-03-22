import isBrowser from "../utils/isBrowser";

import { decommissionedKeys } from "./localStorageKeys";

/**
 * To keep the local storage relatively clean, we may need to remove keys when
 * features are decommissioned, so we run this function when the app starts.
 */
export default function removeDecommissionedKeys() {
  if (!isBrowser) {
    return;
  }
  decommissionedKeys.forEach(({ key }) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // no problem
    }
  });
}
