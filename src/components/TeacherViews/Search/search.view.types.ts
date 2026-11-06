import {
  UseSearchFiltersReturnType,
  SearchQuery,
  SearchHit,
  RequestStatus,
} from "@/context/Search/search.types";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export type SearchProps = {
  searchFilters: UseSearchFiltersReturnType;
  data: SearchPageData;
  query: SearchQuery;
  results: SearchHit[];
  status: RequestStatus;
};
