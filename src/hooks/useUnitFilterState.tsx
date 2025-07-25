import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  // Used to construct a new filter query before using in routing params
  // required for mobile where we don't want to update the URL on every filter change
  const [newFilterQuery, setNewFilterQuery] = useState<FilterQuery | null>(
    null,
  );

  // Filters from the URL query parameters
  const appliedThemeSlug = router.query["learning-theme"]?.toString();
  const appliedCategorySlug = router.query["category"]?.toString();
  const appliedyearGroupSlug = router.query["year"]?.toString();

  // Initialise the new filter query based on the applied filters
  useEffect(() => {
    if (appliedThemeSlug || appliedCategorySlug || appliedyearGroupSlug) {
      setNewFilterQuery({
        theme: appliedThemeSlug || "all",
        category: appliedCategorySlug || undefined,
        year: appliedyearGroupSlug || undefined,
      });
    }
  }, [appliedCategorySlug, appliedThemeSlug, appliedyearGroupSlug]);

  // Latest filters that may not have been applied to the url yet
  const incomingYearSlug = newFilterQuery?.year ?? appliedyearGroupSlug ?? "";
  const incomingCategorySlug =
    newFilterQuery?.category ?? appliedCategorySlug ?? "";
  const incomingThemeSlug = newFilterQuery?.theme ?? appliedThemeSlug ?? "all";

  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] =
    useState<boolean>(false);

  const handleUpdateActiveFilters = (filters: FilterQuery | null) => {
    if (!filters) {
      setNewFilterQuery(null);
      return null;
    } else {
      const params: FilterQuery = { ...newFilterQuery };
      if (filters.year) {
        params.year = filters.year;
      } else if (filters.year === null) {
        params.year = "";
      }
      if (filters.category) {
        params.category = filters.category;
      } else if (filters.category === null) {
        params.category = "";
      }
      if (filters.theme) {
        params.theme = filters.theme;
      }
      setNewFilterQuery(params);
      return params;
    }
  };

  const handleSubmitFilterQuery = (filterQuery?: FilterQuery | null) => {
    const filterQueryToUse = filterQuery || newFilterQuery;
    if (filterQueryToUse) {
      const params = { ...router.query };
      let theme, category, year;
      if (filterQueryToUse.year) {
        params.year = filterQueryToUse.year;
        year = filterQueryToUse.year;
      } else {
        delete params.year;
      }
      if (filterQueryToUse.category) {
        params.category = filterQueryToUse.category;
        category = filterQueryToUse.category;
      } else {
        delete params.category;
      }
      if (filterQueryToUse.theme) {
        params["learning-theme"] = filterQueryToUse.theme;
        theme = filterQueryToUse.theme;
      } else {
        params["learning-theme"] = "all";
      }
      if (isUnitListing) {
        const activeFilters = {
          content_types: "units",
          learning_themes: theme,
          year_group: year,
          category,
        };

        const filterValue = filterQuery
          ? theme || category || year || ""
          : "show results button";
        const filterType: FilterTypeValueType = filterQuery
          ? theme
            ? "Learning theme filter"
            : category
              ? "Subject filter"
              : "Year filter"
          : "Subject filter"; // default to Subject filter for mobile submit button

        track.browseRefined({
          platform: "owa",
          product: "teacher lesson resources",
          engagementIntent: "refine",
          componentType: "filter_link",
          eventVersion: "2.0.0",
          analyticsUseCase: "Teacher",
          filterValue,
          filterType,
          activeFilters,
        });
      }
      setIsMobileFilterDrawerOpen(false);

      router.replace(
        {
          pathname: router.pathname,
          query: params,
        },
        undefined,
        { shallow: true },
      );
    }
  };

  // Used on desktop to update and submit in one go
  const handleUpdateAndSubmitFilterQuery = (queryObj: FilterQuery | null) => {
    const updatedQuery = handleUpdateActiveFilters(queryObj);
    handleSubmitFilterQuery(updatedQuery);
  };

  return {
    isMobileFilterDrawerOpen,
    setIsMobileFilterDrawerOpen,
    handleUpdateActiveFilters,
    handleUpdateAndSubmitFilterQuery,
    handleSubmitFilterQuery,
    appliedThemeSlug,
    appliedCategorySlug,
    appliedyearGroupSlug,
    incomingThemeSlug,
    incomingCategorySlug,
    incomingYearSlug,
  };
};
