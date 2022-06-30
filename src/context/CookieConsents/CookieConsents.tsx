import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";

import OakError from "../../errors/OakError";
import useLocalStorage from "../../hooks/useLocalStorage";

export const policyToConsent = (policy: Policy, enabled = false) => {
  return {
    id: policy.id,
    version: policy.version,
    enabled: policy.required || enabled,
  };
};

export const isPolicyConsentedTo =
  (consents: CookieConsents) => (policy: Policy) => {
    if (policy.required) {
      return true;
    }
    const consent = consents[policy.id];

    if (!consent) {
      // so consent found for this policy (in this case, user should see cookie banner)
      return false;
    }

    if (consent.version !== policy.version) {
      // user's consent choice refers to out of date policy version
      return false;
    }

    return consent.enabled;
  };

type CookieConsent = {
  id: string;
  version: number;
  enabled: boolean;
};
export type CookieConsents = Record<string, CookieConsent>;

const policiesSchema = z.array(
  z.object({
    id: z.string(),
    version: z.number(),
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    providers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        privacyUrl: z.string().url(),
        slug: z.string(),
      })
    ),
  })
);
export type Policies = z.infer<typeof policiesSchema>;
export type Policy = Policies[number];

export type CookieConsentsContext = {
  // saves user's choices. If no argument passed, defaults are saved
  saveConsents: (choices?: CookieConsents) => void;
  // user consent choices
  consents: CookieConsents;
  // list of cookie "policies"
  policies: Policies;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  // if there are new/updated policies (including if the user has never responded)
  shouldShowBanner: boolean;
  // whether the user has at any point confirmed their consent choices
  userHasResponded: boolean;
  // whether the user has granted consent to a partular policy
  isConsented: (policySlug: string) => boolean;
  defaultConsents: CookieConsents;
};

export const cookieContextContext = createContext<CookieConsentsContext | null>(
  null
);

export const CookieConsentsProvider: FC = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [policies, setPolicies] = useState<Policies>([]);
  const [consents, setConsents] = useLocalStorage<CookieConsents>(
    "cookie-consents",
    {}
  );
  const fetchPolicies = useCallback(async () => {
    try {
      const res = await fetch("/api/cookies/policies");

      console.log("fetchPolicies", res);

      if (!res.ok) {
        const json = await res.json();
        throw new OakError({ code: "misc/network-error", meta: { json } });
      }

      const json = await res.json();

      const allPolicies = policiesSchema.parse(json);
      setPolicies(allPolicies);
    } catch (error) {
      // @todo handle error
      console.log(error);
    }
  }, []);

  const postConsents = useCallback(async (_consents: CookieConsents) => {
    try {
      const consentsArray = Object.values(_consents);
      const res = await fetch("/api/cookies/consent", {
        method: "POST",
        body: JSON.stringify(consentsArray),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new OakError({ code: "misc/network-error", meta: { json } });
      }
    } catch (error) {
      // @todo handle error
    }
  }, []);

  /**
   * Consents object with default 'enabled' values.
   * If a user has made a choice regarding a particular policy but in reference
   * to a previous version, that that becomes the default choice for the
   * current version.
   */
  const defaultConsents = useMemo(
    () =>
      policies.reduce((accum: CookieConsents, policy) => {
        const consent = consents[policy.id];
        accum[policy.id] = policyToConsent(policy, consent?.enabled);
        return accum;
      }, {}),
    [policies, consents]
  );

  /**
   * Saves consents in local storage, and posts choices to a server for logging
   * to be stored in case of audit.
   */
  const saveConsents = useCallback(
    async (choices?: CookieConsents) => {
      const consentsToSave = {
        ...defaultConsents,
        ...choices,
      };
      setConsents(consentsToSave);
      postConsents(consentsToSave);
    },
    [postConsents, setConsents, defaultConsents]
  );

  const isConsented = (policySlug: string) => {
    const policy = policies.find(
      (eachPolicy) => eachPolicy.slug === policySlug
    );
    if (!policy) {
      // no policy found with this slug
      // @todo report errro
      return false;
    }

    return isPolicyConsentedTo(consents)(policy);
  };

  useEffect(() => {
    // fetch policies on first render
    console.log("fetching policies");

    fetchPolicies();
  }, [fetchPolicies]);

  // policies which have been updated since consent was given
  const updatedPolicies = policies.filter((policy) => {
    const consent = consents[policy.id];
    if (!consent) {
      return false;
    }
    if (consent.version < policy.version) {
      return true;
    }

    return false;
  });
  // policies which did not exist since consent was given
  const newPolicies = policies.filter((policy) => {
    const consent = consents[policy.id];

    return !consent;
  });

  const shouldShowBanner = updatedPolicies.length > 0 || newPolicies.length > 0;
  const userHasResponded = Object.keys(consents).length > 0;

  const cookieConsentsContext = {
    saveConsents,
    consents,
    policies,
    modalOpen,
    setModalOpen,
    shouldShowBanner,
    userHasResponded,
    isConsented,
    defaultConsents,
  };

  return (
    <cookieContextContext.Provider value={cookieConsentsContext}>
      {children}
    </cookieContextContext.Provider>
  );
};

export const useCookieConsents = () => {
  const cookieConsentsContext = useContext(cookieContextContext);
  if (!cookieConsentsContext) {
    throw new Error(
      "useCookieConsents() called outside of cookieConsentsContext provider"
    );
  }
  return cookieConsentsContext;
};
