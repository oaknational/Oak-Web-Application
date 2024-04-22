import { FC } from "react";

import { SizeProps } from "@/styles/utils/size";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Box from "@/components/SharedComponents/Box";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";

type SearchFilterCheckboxProps = {
  name: string;
  slug: string;
  label: string;
  checked: boolean;
  width?: SizeProps["$width"];
  onChange: () => void;
  filterType: FilterTypeValueType;
  searchRefined: (filterType: FilterTypeValueType, filterValue: string) => void;
  onFilterClick: (filter: string | undefined) => void;
  lastFocussedFilter: string | null;
};

const SearchFilterCheckbox: FC<SearchFilterCheckboxProps> = (props) => {
  const {
    slug,
    label,
    onChange,
    checked,
    name,
    width = "50%",
    filterType,
    searchRefined,
    onFilterClick,
    lastFocussedFilter,
  } = props;

  return (
    <Box $width={width}>
      <Checkbox
        labelText={`${label}`}
        ariaLabel={`${label} filter`}
        id={`custom-checkbox-${slug}`}
        name={name}
        checked={checked}
        autoFocus={lastFocussedFilter === slug}
        onChange={(e) => {
          if (
            (e.nativeEvent as PointerEvent).clientX !== 0 ||
            (e.nativeEvent as PointerEvent).clientY !== 0
          ) {
            // set undefined on mouse click
            onFilterClick(undefined);
          } else {
            // store last filter clicked by keyboard
            onFilterClick(slug);
          }
          onChange();
          if (!checked) {
            searchRefined(filterType, label);
          }
        }}
      />
    </Box>
  );
};

export default SearchFilterCheckbox;
