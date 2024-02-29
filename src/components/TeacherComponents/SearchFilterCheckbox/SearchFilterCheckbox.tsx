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
  } = props;

  return (
    <Box $width={width}>
      <Checkbox
        labelText={`${label}`}
        ariaLabel={`${label} filter`}
        id={`custom-checkbox-${slug}`}
        name={name}
        checked={checked}
        onChange={() => {
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
