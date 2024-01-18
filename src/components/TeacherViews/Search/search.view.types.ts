import {
  UseSearchFiltersReturnType,
  KeyStage,
} from "@/context/Search/search.types";
import { UseSearchReturnType } from "@/context/Search/useSearch";

export type SearchProps = UseSearchReturnType & {
  searchFilters: UseSearchFiltersReturnType;
  allKeyStages: KeyStage[];
};
