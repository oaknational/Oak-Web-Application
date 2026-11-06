import {
  SearchQuery,
  SearchHit,
  RequestStatus,
  GetSearchFiltersReturnType,
} from "@/context/Search/search.types";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export type SearchProps = {
  searchFilters: GetSearchFiltersReturnType;
  allKeyStages: SearchPageData["keyStages"];
  query: SearchQuery;
  results: SearchHit[];
  status: RequestStatus;
  timeTaken: number;
};
