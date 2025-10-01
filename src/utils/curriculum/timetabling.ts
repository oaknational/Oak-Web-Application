"use client";

import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

const TIMETABLE_HEADER_PARAM_KEYS = [
  "subject",
  "year",
  "autumn",
  "spring",
  "summer",
  "name",
] as const;

export type TimetableHeaderParamKey =
  (typeof TIMETABLE_HEADER_PARAM_KEYS)[number];

const defaults = {
  autumn: 30,
  spring: 30,
  summer: 30,
  name: "",
  year: 1,
};

const schema = z.object({
  autumn: z.coerce.number().default(defaults.autumn),
  spring: z.coerce.number().default(defaults.spring),
  summer: z.coerce.number().default(defaults.summer),
  year: z.string().default("1"),
  name: z.string().default(defaults.name),
});

type TimetableParams = z.infer<typeof schema>;

export type useTimetableParamsHook = [
  Partial<TimetableParams>,
  (newData: Partial<TimetableParams>) => void,
];

function safeFetchData(searchParams: ReadonlyURLSearchParams | null) {
  const obj = objectFromSearchParams(searchParams);
  const result = schema.safeParse({ ...obj });
  return result.data ?? {};
}

export function useTimetableParams(): useTimetableParamsHook {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [data, setData] = useState(() => {
    return safeFetchData(searchParams);
  });

  useEffect(() => {
    setData(safeFetchData(searchParams));
  }, [searchParams]);

  const setDataHandler = (newData: Partial<TimetableParams>) => {
    const result = schema.safeParse({ ...data, ...newData });
    const allData = result.data ?? {};
    const newSearchParams = simpleObjectAsSearchParams(allData, defaults);
    setData(allData);
    window.history.replaceState(
      {},
      "",
      `${pathname}?${newSearchParams.toString()}`,
    );
  };

  return [data, setDataHandler];
}

export function objectFromSearchParams(
  searchParams: ReadonlyURLSearchParams | null,
) {
  return Object.fromEntries(searchParams?.entries() ?? []);
}

export function simpleObjectAsSearchParams(
  data: Record<string, string | number | boolean>,
  defaults?: Record<string, string | number | boolean>,
) {
  const filteredData = { ...data };
  if (defaults) {
    for (const key of Object.keys(defaults)) {
      if (filteredData[key] === defaults[key]) {
        delete filteredData[key];
      }
    }
  }
  const obj = Object.entries(filteredData)
    .sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    })
    .map((v) => [v[0], v[1].toString()]);
  return new URLSearchParams(obj);
}
