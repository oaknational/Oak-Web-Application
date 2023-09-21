import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { LS_KEY_UTM_PARAMS } from "../config/localStorageKeys";

import useLocalStorage from "./useLocalStorage";

const paramNames = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmParamName = typeof paramNames[number];

export type UtmParams = Partial<Record<UtmParamName, string>>;
/**
 * This hook returns the last known UTM parameters.
 * We're using local storage (as we are with anonymous-id), the downside being
 * that if multiple users are using the same browser account, then there's a
 * possibility that a conversion is wrongly attributed. But it's very much
 * an edge case.
 */
const useUtmParams = (): UtmParams => {
  const router = useRouter();

  const [utmParams, setUtmParams] = useLocalStorage<UtmParams>(
    LS_KEY_UTM_PARAMS,
    {}
  );

  const utmParamsFromQuery = useMemo(
    () =>
      paramNames.reduce((accum: UtmParams, curr) => {
        const param = router.query[curr];

        if (Array.isArray(param) && param[0]) {
          accum[curr] = param[0];
        }
        if (typeof param === "string") {
          accum[curr] = param;
        }

        return accum;
      }, {}),
    [router.query]
  );

  useEffect(() => {
    if (Object.keys(utmParamsFromQuery).length) {
      // Only update utmParams if the query contains
      setUtmParams(utmParamsFromQuery);
    }
  }, [utmParamsFromQuery, setUtmParams]);

  return utmParams;
};

export default useUtmParams;
