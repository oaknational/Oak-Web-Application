import {
  UseSearchFiltersReturnType,
  KeyStage,
  SearchQuery,
  SearchHit,
} from "@/context/Search/search.types";
import { RequestStatus } from "@/context/Search/useSearch";

export type SearchProps = {
  searchFilters: UseSearchFiltersReturnType;
  allKeyStages: KeyStage[];
  query: SearchQuery;
  results: SearchHit[];
  status: RequestStatus;
};
