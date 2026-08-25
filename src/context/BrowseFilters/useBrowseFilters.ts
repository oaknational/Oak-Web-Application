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

  const setSingleFilter = useCallback(
    (
      key: BrowseFiltersKey,
      value: string | string[],
      filterType: FilterTypeValueType,
    ) => {
      const filterValue = Array.isArray(value) ? "all" : value;
      const getNewFilter = () => {
        if (Array.isArray(value)) {
          return value;
        } else if (value) {
          return [value];
        }
        return [];
      };
      onChangeFilters({
        newFilters: { ...filters, [key]: getNewFilter() },
        filterType,
        filterValue: filterValue,
      });
    },
    [filters, onChangeFilters],
  );

  const setYearFilter = useCallback(
    (year: string, allYears: string[]) => {
      const filterValue = year === "all" ? allYears : year;
      setSingleFilter("years", filterValue, FilterType.YEAR_FILTER);
    },
    [setSingleFilter],
  );

  const setThreadFilter = useCallback(
    (threadSlug: string) => {
      setSingleFilter("threads", threadSlug, FilterType.LEARNING_THEME_FILTER);
    },
    [setSingleFilter],
  );

  const setChildSubjectFilter = useCallback(
    (childSubjectSlug: string) => {
      setSingleFilter(
        "childSubjects",
        childSubjectSlug,
        FilterType.SUBJECT_FILTER,
      );
    },
    [setSingleFilter],
  );

  const setSubjectCategoryFilter = useCallback(
    (subjectCategory: string) => {
      setSingleFilter(
        "subjectCategories",
        subjectCategory,
        FilterType.SUBJECT_FILTER,
      );
    },
    [setSingleFilter],
  );

  const setTierFilter = useCallback(
    (tierSlug: string) => {
      setSingleFilter("tiers", tierSlug, FilterType.TIER_FILTER);
    },
    [setSingleFilter],
  );

  return {
    filters,
    onChangeFilters,
    getFilter,
    setYearFilter,
    setThreadFilter,
    setChildSubjectFilter,
    setSubjectCategoryFilter,
    setTierFilter,
  };
};
