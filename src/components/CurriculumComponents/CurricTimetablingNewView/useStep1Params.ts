"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const ALLOWED_KEYS = ["subject", "year", "autumn", "spring", "summer"] as const;

export interface Step1ParamsHook {
  subject: string;
  year: string;
  queryParams: URLSearchParams;
  queryString: string;
}

export function useStep1Params(): Step1ParamsHook {
  const DEFAULT_LESSONS = 30;
  const DEFAULT_SUBJECT = "maths";
  const DEFAULT_YEAR = "1";

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const canonicalQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    const subject = searchParams?.get("subject") ?? DEFAULT_SUBJECT;
    const year = searchParams?.get("year") ?? DEFAULT_YEAR;
    params.set("subject", subject);
    params.set("year", year);
    (["autumn", "spring", "summer"] as const).forEach((key) => {
      const value = searchParams?.get(key) ?? String(DEFAULT_LESSONS);
      params.set(key, value);
    });
    return params;
  }, [searchParams, DEFAULT_SUBJECT, DEFAULT_YEAR, DEFAULT_LESSONS]);

  const canonicalQueryParamsString = useMemo(
    () => canonicalQueryParams.toString(),
    [canonicalQueryParams],
  );

  const { subject, year } = useMemo(() => {
    const s = searchParams?.get("subject") ?? DEFAULT_SUBJECT;
    const y = searchParams?.get("year") ?? DEFAULT_YEAR;
    return { subject: s, year: y };
  }, [searchParams, DEFAULT_SUBJECT, DEFAULT_YEAR]);

  const currentQueryParamsString = useMemo(() => {
    const filtered = new URLSearchParams();
    if (searchParams) {
      ALLOWED_KEYS.forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null) filtered.set(key, value);
      });
    }
    return filtered.toString();
  }, [searchParams]);

  useEffect(() => {
    if (currentQueryParamsString !== canonicalQueryParamsString) {
      router.replace(`${pathname}?${canonicalQueryParamsString}`);
    }
  }, [currentQueryParamsString, canonicalQueryParamsString, router, pathname]);

  return {
    subject,
    year,
    queryParams: canonicalQueryParams,
    queryString: canonicalQueryParamsString,
  };
}
