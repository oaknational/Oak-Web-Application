import { FC } from "react";

import Box from "../Box";
import Checkbox from "../Checkbox";

type SearchFilterCheckboxProps = {
  name: string;
  slug: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};
const SearchFilterCheckbox: FC<SearchFilterCheckboxProps> = (props) => {
  const { slug, label, onChange, checked, name } = props;
  return (
    <Box $width={"50%"}>
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
