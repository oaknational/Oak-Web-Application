import { getDefaultBrowseFilter } from "./getDefaultBrowseFilter";
import {
  RawSearchParams,
  resolveBrowseFilterFromSearchParams,
} from "./resolveBrowseFilterFromSearchParams";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export const getBrowseFilterState = ({
  data,
  searchParams,
}: {
  data: CurriculumUnitsFormattedData;
  searchParams?: RawSearchParams;
}) => {
  const defaultFilter = getDefaultBrowseFilter(data);
  const resolvedFilter = resolveBrowseFilterFromSearchParams(
    defaultFilter,
    searchParams,
  );

  return { defaultFilter, resolvedFilter };
};
