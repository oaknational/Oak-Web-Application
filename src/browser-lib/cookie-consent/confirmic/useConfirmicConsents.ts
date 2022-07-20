import { useEffect, useState } from "react";

import {
  CookieConsentChoice,
  CookiePolicyName,
  COOKIE_POLICY_NAMES,
  defaultConsentChoice,
} from "../types";

const safeLocalStorage = {
  setItem: (keyName: string, keyValue: string) => {
    try {
      return window.localStorage.setItem(keyName, keyValue);
    } catch (e) {
      return null;
    }
  },
  getItem: (keyName: string) => {
    try {
      return window.localStorage.getItem(keyName);
    } catch (e) {
      return null;
    }
  },
  removeItem: (keyName: string) => {
    try {
      return window.localStorage.removeItem(keyName);
    } catch (e) {
      return null;
    }
  },
  clear: () => {
    try {
      return window.localStorage.clear();
    } catch (e) {
      return null;
    }
  },
};

const consentPolicyMap: Record<CookiePolicyName, string> = {
  strictlyNecessary:
    "metomic-consented-pol:3c779fd2-9d6b-4613-8eed-e746cb669d7e",
  embeddedContent: "metomic-consented-pol:68beb01a-65f3-481d-b9db-be05ad95c5a1",
  statistics: "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
};

type ConfirmicConsents = {
  strictlyNecessary: CookieConsentChoice;
  embeddedContent: CookieConsentChoice;
  statistics: CookieConsentChoice;
};

export const getConsentsFromLocalStorage = () => {
  return COOKIE_POLICY_NAMES.reduce(
    (accum: ConfirmicConsents, policyName) => {
      const localStorageKey = consentPolicyMap[policyName];
      const localStorageItem = safeLocalStorage.getItem(localStorageKey);

      if (!localStorageItem) {
        // Policy not found, so likely that the user hasn't addressed the widget yet
        accum[policyName] = defaultConsentChoice;
        return accum;
      }

      try {
        const { enabled, version } = JSON.parse(localStorageItem);
        // Use "enabled" value found in localStorage
        accum[policyName] = {
          enabled: Boolean(enabled),
          version,
        };
      } catch (error) {
        // @todo report error
        // JSON could not be parsed, default to enabled:false
        accum[policyName] = defaultConsentChoice;
      }

      return accum;
    },
    {
      strictlyNecessary: defaultConsentChoice,
      embeddedContent: defaultConsentChoice,
      statistics: defaultConsentChoice,
    }
  );
};

/**
 * @returns {ConfirmicConsents}
 */
const useConfirmicConsents = () => {
  /**
   * @todo warn if this is called more than once, as that would cause excessive
   * local storage activity
   */
  const [consents, setConsents] = useState<ConfirmicConsents>(
    getConsentsFromLocalStorage()
  );

  useEffect(() => {
    const updateStateFromLocalStorage = () => {
      const consentsFromLocalStorage = getConsentsFromLocalStorage();
      setConsents(consentsFromLocalStorage);
    };
    updateStateFromLocalStorage();
    window.addEventListener("storage", updateStateFromLocalStorage);
    return () =>
      window.removeEventListener("storage", updateStateFromLocalStorage);
  }, []);

  return consents;
};

export default useConfirmicConsents;
