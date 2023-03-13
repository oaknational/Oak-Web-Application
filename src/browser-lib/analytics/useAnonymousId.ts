import { useEffect } from "react";

import { LS_KEY_ANONYMOUS_ID } from "../../config/localStorageKeys";
import useAnalytics from "../../context/Analytics/useAnalytics";
import useLocalStorage from "../../hooks/useLocalStorage";

import getOrGenerateAnonymousId, {
  AnonymousUserId,
  OLD_ANONYMOUS_ID_KEY,
} from "./getOrGenerateAnonymousId";
import setLegacyCookieIfNotPresent from "./setLegacyCookieIfNotPresent";

const anonymousId = getOrGenerateAnonymousId();

const useAnonymousId = (): AnonymousUserId => {
  const analytics = useAnalytics();
  const [, setAnonymousId] = useLocalStorage(LS_KEY_ANONYMOUS_ID, anonymousId);

  useEffect(() => {
    if (anonymousId) {
      setAnonymousId(anonymousId);
      setLegacyCookieIfNotPresent({ anonymousId });
      analytics.posthogSetAnonymousId(anonymousId);
    }
  }, [setAnonymousId, analytics]);

  useEffect(() => {
    // Clean up old local storage key
    window.localStorage.removeItem(OLD_ANONYMOUS_ID_KEY);
  }, []);

  return anonymousId;
};

export default useAnonymousId;
export type { AnonymousUserId };
