"use client";
import { useCallback } from "react";

import { useBrowseFiltersStore } from "./BrowseFiltersProvider";

import {
  CurriculumFilters,
  OnChangeCurriculumFilters,
} from "@/utils/curriculum/types";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export const useBrowseFilters = (): {
  filters: CurriculumFilters;
  onChangeFilters: OnChangeCurriculumFilters;
} => {
  const filters = useBrowseFiltersStore((store) => store.filters);
  const setFilters = useBrowseFiltersStore((store) => store.setFilters);
  const programmeRefined = useTeacherBrowseAnalytics(
    (store) => store.track.programmeRefined,
  );

  const onChangeFilters = useCallback<OnChangeCurriculumFilters>(
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

  return { filters, onChangeFilters };
};
