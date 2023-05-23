import { FC } from "react";

import { SizeProps } from "../../styles/utils/size";
import Box from "../Box";
import Checkbox from "../Checkbox";

type SearchFilterCheckboxProps = {
  name: string;
  slug: string;
  label: string;
  checked: boolean;
  width?: SizeProps["$width"];
  onChange: () => void;
};
const SearchFilterCheckbox: FC<SearchFilterCheckboxProps> = (props) => {
  const { slug, label, onChange, checked, name, width = "50%" } = props;
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
