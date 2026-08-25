"use client";
import { useCallback } from "react";

import { useBrowseFiltersStore } from "./BrowseFiltersProvider";
import { OnChangeBrowseFilters } from "./types";

import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

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

  return { filters, onChangeFilters, getFilter };
};
