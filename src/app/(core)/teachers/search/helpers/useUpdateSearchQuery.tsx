import { useRouter, useSearchParams } from "next/navigation";

import { resolveOakHref } from "@/common-lib/urls";
import { SearchFilterKey, SearchQuery } from "@/context/Search/search.types";

export const useUpdateSearchQuery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchTerm = ({ searchTerm }: { searchTerm: string }) => {
    const params = new URLSearchParams(searchParams ?? undefined);
    params.delete("page"); // reset pagination param when term changes
    const newQuery = { ...Object.fromEntries(params), term: searchTerm };
    const url = resolveOakHref({
      page: "search",
      query: newQuery,
    });
    router.push(url);
  };

  const updateSearchFilters = ({
    filterSlug,
    filterType,
  }: {
    filterSlug: string;
    filterType: SearchFilterKey;
  }) => {
    if (!searchParams) {
      return;
    }
    const currentValues = searchParams?.get(filterType)?.split(",") || [];
    const active = currentValues.includes(filterSlug);
    const partialSearchQuery: Partial<SearchQuery> = {
      [filterType]: active
        ? currentValues.filter((filterItem) => filterItem !== filterSlug)
        : [currentValues, filterSlug].flat(),
    };

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("page");

    const url = resolveOakHref({
      page: "search",
      query: { ...Object.fromEntries(nextParams), ...partialSearchQuery },
    });
    router.push(url);
  };

  return { updateSearchTerm, updateSearchFilters };
};
