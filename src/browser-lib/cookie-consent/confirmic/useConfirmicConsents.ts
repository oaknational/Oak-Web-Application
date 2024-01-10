import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import {
  CookieConsent,
  CookieConsentState,
  CookiePolicyName,
  COOKIE_POLICY_NAMES,
  defaultConsent,
} from "../types";

import cookieOptions from "./cookieOptions";

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
} as const;

type ConfirmicConsents = {
  strictlyNecessary: CookieConsent;
  embeddedContent: CookieConsent;
  statistics: CookieConsent;
};

const stateToEnabled = (state: CookieConsentState) => {
  switch (state) {
    case "enabled":
      return true;
    case "disabled":
      return false;

    default:
      return;
  }
};

const setConsentsInLocalStorage = (consents: ConfirmicConsents) => {
  COOKIE_POLICY_NAMES.forEach((name) => {
    const policyId = consentPolicyMap[name];
    const { version, state } = consents[name];
    const value = {
      enabled: stateToEnabled(state),
      version,
    };
    safeLocalStorage.setItem(policyId, JSON.stringify(value));
  });
};

export const getConsentsFromLocalStorage = () => {
  return COOKIE_POLICY_NAMES.reduce(
    (accum: ConfirmicConsents, policyName) => {
      const localStorageKey = consentPolicyMap[policyName];
      const localStorageItem = safeLocalStorage.getItem(localStorageKey);

      if (!localStorageItem) {
        // Policy not found, so likely that the user hasn't addressed the widget yet
        accum[policyName] = defaultConsent;
        return accum;
      }

      try {
        const { enabled, version } = JSON.parse(localStorageItem);
        // Use "enabled" value found in localStorage
        accum[policyName] = {
          state:
            enabled === true
              ? "enabled"
              : enabled === false
              ? "disabled"
              : "pending",
          version,
        };
      } catch (error) {
        // @todo report error
        // JSON could not be parsed, default to enabled:false
        accum[policyName] = defaultConsent;
      }

      return accum;
    },
    {
      strictlyNecessary: defaultConsent,
      embeddedContent: defaultConsent,
      statistics: defaultConsent,
    },
  );
};

type ConfirmicPolicyId = string;
type ConsentTuple = [ConfirmicPolicyId, string];
export const toTuples = (consents: ConfirmicConsents): ConsentTuple[] => {
  return Object.entries(consentPolicyMap)
    .filter((entry) => {
      /**
       * Filter out "default" consents which aren't compatible with Acorn apps
       */
      const [policyName] = entry as [CookiePolicyName, ConfirmicPolicyId];
      return consents[policyName]?.version !== defaultConsent.version;
    })
    .map((entry) => {
      const [policyName, policyId] = entry as [
        CookiePolicyName,
        ConfirmicPolicyId,
      ];
      return [
        policyId,
        JSON.stringify({
          enabled: consents[policyName]?.state === "enabled",
          version: consents[policyName]?.version,
        }),
      ] as ConsentTuple;
    });
};
export const fromTuples = (
  tuples: ConsentTuple[] | unknown,
): ConfirmicConsents | undefined => {
  if (!Array.isArray(tuples)) {
    return;
  }
  const fromTuplesByName = (
    name: CookiePolicyName,
  ): CookieConsent | undefined => {
    try {
      const policyId = consentPolicyMap[name];
      const detailStr = tuples.find(
        ([_policyId]) => _policyId === policyId,
      )?.[1];
      if (!detailStr) {
        return;
      }

      const detail = JSON.parse(detailStr);

      return {
        version: detail.version,
        state: detail.enabled ? "enabled" : "disabled",
      };
    } catch (error) {
      return;
    }
  };
  const strictlyNecessary = fromTuplesByName("strictlyNecessary");
  const embeddedContent = fromTuplesByName("embeddedContent");
  const statistics = fromTuplesByName("statistics");

  if (!strictlyNecessary || !embeddedContent || !statistics) {
    return;
  }
  return {
    strictlyNecessary,
    embeddedContent,
    statistics,
  };
};

export const safeStringify = (value: ConsentTuple[]) => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    // non-critical error
    return;
  }
};

const CONFIRMIC_COOKIE_NAME = "cookie-consents";

const useConfirmicConsents = () => {
  const [consentCookie, setConsentCookie] = useCookies([CONFIRMIC_COOKIE_NAME]);
  const consentTupleFromCookie = consentCookie[CONFIRMIC_COOKIE_NAME];
  const consentsFromCookie = fromTuples(consentTupleFromCookie);
  const [consents, setConsents] = useState<ConfirmicConsents>(
    consentsFromCookie || getConsentsFromLocalStorage(),
  );

  const tuples = toTuples(consents);
  const tuplesString = safeStringify(tuples);

  useEffect(() => {
    /**
     * If user updates their consents in this browser window, then local
     * storage will update, which will in turn update state in this hook, which
     * will then update the value of the cookie, which will propagate to other
     * thenational.academy subdomains
     **/
    if (tuples) {
      const tuplesStringFromCookies = safeStringify(consentTupleFromCookie);

      if (tuplesStringFromCookies !== tuplesString) {
        setConsentCookie(CONFIRMIC_COOKIE_NAME, tuples, cookieOptions);
      }

      const consentsFromLocalStorage = getConsentsFromLocalStorage();
      const tuplesStringFromLocalStorage = safeStringify(
        toTuples(consentsFromLocalStorage),
      );
      if (tuplesStringFromLocalStorage !== tuplesString) {
        setConsentsInLocalStorage(consents);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuplesString, setConsentCookie]);

  useEffect(() => {
    const updateStateFromLocalStorage = () => {
      const consentsFromLocalStorage = getConsentsFromLocalStorage();
      setConsents(consentsFromLocalStorage);
    };
    updateStateFromLocalStorage();
    window.addEventListener("storage", updateStateFromLocalStorage);
    return () =>
      window.removeEventListener("storage", updateStateFromLocalStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return consents;
};

export default useConfirmicConsents;
