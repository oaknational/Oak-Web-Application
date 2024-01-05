import { FC, useEffect } from "react";

import { SizeProps } from "../../styles/utils/size";
import Checkbox from "../Checkbox";

import Box from "@/components/SharedComponents/Box";

type SearchFilterCheckboxProps = {
  name: string;
  slug: string;
  label: string;
  checked: boolean;
  width?: SizeProps["$width"];
  onChange: () => void;
  filterType: string;
  searchRefined: (filterType: string, filterValue: string) => void;
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

  useEffect(() => {
    if (checked) {
      searchRefined(filterType, label);
    }
  }, [checked]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box $width={width}>
      <Checkbox
        labelText={`${label}`}
        ariaLabel={`${label} filter`}
        id={`custom-checkbox-${slug}`}
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </Box>
  );
};

export default SearchFilterCheckbox;
