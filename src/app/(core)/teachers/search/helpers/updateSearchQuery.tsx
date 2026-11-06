import { useRouter, useSearchParams } from "next/navigation";

import { constructSearchQuery } from "./constructSearchQuery";

import { resolveOakHref } from "@/common-lib/urls";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";


export const useUpdateSearchQuery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchQuery = ({
    searchTerm,
    data,
  }: {
    searchTerm: string;
    data?: SearchPageData;
  }) => {
    const newQuery = constructSearchQuery({
      searchParams: { ...searchParams, term: searchTerm },
      data,
    });
    const url = resolveOakHref({
      page: "search",
      query: newQuery,
    });
    router.push(url);
  };

  return { updateSearchQuery };
};
