"use client";
import { useCallback } from "react";

import { useCurriculumFiltersStore } from "./CurriculumFiltersProvider";

import {
  CurriculumFilters,
  OnChangeCurriculumFilters,
} from "@/utils/curriculum/types";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

/**
 * Composes the filters store with browse analytics.
 *
 * The filters store deliberately knows nothing about analytics: it is mounted
 * in places the `TeacherBrowseAnalyticsStoreProvider` isn't, and injecting the
 * tracking functions into it would make the analytics context a hard
 * requirement for rendering a filter. Pairing the two here — where both
 * providers are known to exist — keeps that dependency one-directional.
 *
 * This is the intended entry point for programme page filter interactions;
 * reaching for `setFilters` directly will silently drop the tracking event.
 */
export const useProgrammeFilters = (): {
  filters: CurriculumFilters;
  onChangeFilters: OnChangeCurriculumFilters;
} => {
  const filters = useCurriculumFiltersStore((store) => store.filters);
  const setFilters = useCurriculumFiltersStore((store) => store.setFilters);
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
