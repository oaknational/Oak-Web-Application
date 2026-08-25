"use client";
import { useCallback } from "react";

import { useBrowseFiltersStore } from "./BrowseFiltersProvider";
import { BrowseFiltersKey, OnChangeBrowseFilters } from "./types";

import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { FilterType, FilterTypeValueType } from "@/browser-lib/avo/Avo";

export const useBrowseFilters = () => {
  const filters = useBrowseFiltersStore((store) => store.filters);
  const setFilters = useBrowseFiltersStore((store) => store.setFilters);
  const getFilter = useBrowseFiltersStore((store) => store.getFilter);
  const programmeRefined = useTeacherBrowseAnalytics(
    (store) => store.track.programmeRefined,
  );

  const onChangeFilters = useCallback<OnChangeBrowseFilters>(
    ({ newFilters, filterType, filterValue }) => {
      setFilters(newFilters);

      if (!filterType) {
        return;
      }

      programmeRefined({
        componentType: "filter_link",
        activeFilters: newFilters,
        filterType,
        filterValue,
      });
    },
    [setFilters, programmeRefined],
  );

  const setYearFilter = useCallback(
    (year: string, allYears: string[]) => {
      if (year === "all") {
        onChangeFilters({
          newFilters: { ...filters, years: allYears, pathways: [] },
          filterType: FilterType.YEAR_FILTER,
          filterValue: "all",
        });
      } else {
        onChangeFilters({
          newFilters: { ...filters, years: [year], pathways: [] },
          filterType: FilterType.YEAR_FILTER,
          filterValue: year,
        });
      }
    },
    [filters, onChangeFilters],
  );

  const setSingleFilter = useCallback(
    (key: BrowseFiltersKey, value: string, filterType: FilterTypeValueType) => {
      onChangeFilters({
        newFilters: { ...filters, [key]: [value] },
        filterType,
        filterValue: value,
      });
    },
    [filters, onChangeFilters],
  );

  const setThreadFilter = useCallback(
    (threadSlug: string) => {
      const threads = threadSlug === "" ? [] : [threadSlug];
      onChangeFilters({
        newFilters: { ...filters, threads },
        filterType: FilterType.LEARNING_THEME_FILTER,
        filterValue: threadSlug,
      });
    },
    [filters, onChangeFilters],
  );

  return {
    filters,
    onChangeFilters,
    getFilter,
    setYearFilter,
    setSingleFilter,
    setThreadFilter,
  };
};
