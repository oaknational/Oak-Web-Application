import { FC } from "react";

import { KeyStage } from "../../context/Search/useKeyStageFilters";
import Box from "../Box";
import Checkbox from "../Checkbox";

type KeyStageFilterProps = KeyStage & {
  checked: boolean;
  onChange: () => void;
};
const KeyStageFilter: FC<KeyStageFilterProps> = (props) => {
  const { slug, title, shortCode, onChange, checked } = props;
  return (
    <Box $width={"50%"}>
      <Checkbox
        labelText={`${shortCode}`}
        ariaLabel={`Toggle ${title} filter`}
        id={`custom-checkbox-${slug}`}
        name={"keyStageFilters"}
        checked={checked}
        onChange={onChange}
      />
    </Box>
  );
};

export default KeyStageFilter;
