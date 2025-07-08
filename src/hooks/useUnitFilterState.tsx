import { useRouter } from "next/router";
import { useState } from "react";

import { FilterTypeValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type FilterQuery = {
  year?: string | null;
  category?: string | null;
  theme?: string | null;
};

export const useUnitFilterState = ({
  isUnitListing,
}: {
  isUnitListing: boolean;
}) => {
  const { track } = useAnalytics();

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();
  const categorySlug = router.query["category"]?.toString();
  const yearGroupSlug = router.query["year"]?.toString();

  // Used to construct a new filter query before using in routing params
  const [newFilterQuery, setNewFilterQuery] = useState<FilterQuery | null>(
    null,
  );

  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] =
    useState<boolean>(false);

  const handleUpdateActiveFilters = (filters: FilterQuery | null) => {
    if (!filters) {
      setNewFilterQuery(null);
      return null;
    } else {
      const params: FilterQuery = Object.assign({}, newFilterQuery);
      if (filters.year) {
        params.year = filters.year;
      } else if (filters.year === null) {
        params.year = "";
      }
      if (filters.category) {
        params.category = filters.category;
      } else if (filters.category === null) {
        delete params.category;
      }
      if (filters.theme) {
        params.theme = filters.theme;
      }
      setNewFilterQuery(params);
      return params;
    }
  };

  const trackFilterRefined = (
    filterType: FilterTypeValueType,
    filterValue: string,
  ) => {
    const activeFilters = {
      content_types: "units",
      learning_themes: filterType !== "Learning theme filter" && themeSlug,
      year_group: filterType !== "Year filter" && yearGroupSlug,
    };
    track.browseRefined({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterValue,
      filterType: "Subject filter",
      activeFilters,
    });
  };

  const handleUpdateAndSubmitFilterQuery = (
    queryObj: FilterQuery | null,
    filterType: FilterTypeValueType,
    filterValue: string,
  ) => {
    const updatedQuery = handleUpdateActiveFilters(queryObj);

    // TODO: extract to shared
    const params = Object.assign({}, router.query);

    if (updatedQuery?.year) {
      params.year = updatedQuery.year;
    } else {
      delete params.year;
    }
    if (updatedQuery?.category) {
      params.category = updatedQuery.category;
    } else {
      delete params.category;
    }
    if (updatedQuery?.theme) {
      params["learning-theme"] = updatedQuery.theme;
    } else {
      params["learning-theme"] = "all";
    }
    trackFilterRefined(filterType, filterValue);
    router.replace(
      {
        pathname: router.pathname,
        query: params,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSubmitFilterQuery = () => {
    if (newFilterQuery) {
      const params = Object.assign({}, router.query);
      let theme, category, year;
      if (newFilterQuery.year) {
        params.year = newFilterQuery.year;
        year = newFilterQuery.year;
      } else {
        delete params.year;
      }
      if (newFilterQuery.category) {
        params.category = newFilterQuery.category;
        category = newFilterQuery.category;
      } else {
        delete params.category;
      }
      if (newFilterQuery.theme) {
        params["learning-theme"] = newFilterQuery.theme;
        theme = newFilterQuery.theme;
      } else {
        params["learning-theme"] = "all";
      }
      if (isUnitListing) {
        track.browseRefined({
          platform: "owa",
          product: "teacher lesson resources",
          engagementIntent: "refine",
          componentType: "filter_link",
          eventVersion: "2.0.0",
          analyticsUseCase: "Teacher",
          filterValue: "show results button",
          filterType: "Subject filter",
          activeFilters: {
            content_types: "units",
            learning_themes: theme,
            categories: category,
            year: year,
          },
        });
      }
      setIsMobileFilterDrawerOpen(false);
      router.replace({
        pathname: router.pathname,
        query: params,
      });
    }
  };

  return {
    newFilterQuery,
    isMobileFilterDrawerOpen,
    setIsMobileFilterDrawerOpen,
    handleUpdateActiveFilters,
    handleUpdateAndSubmitFilterQuery,
    handleSubmitFilterQuery,
    themeSlug,
    categorySlug,
    yearGroupSlug,
  };
};
