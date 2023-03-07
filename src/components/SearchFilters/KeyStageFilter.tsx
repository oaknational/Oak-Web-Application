import { FC } from "react";

import { KeyStage } from "../../context/Search/SearchContext";
import useKeyStageToggle from "../../context/Search/useKeyStageToggle";
import Box from "../Box";
import Checkbox from "../Checkbox";

type KeyStageFilterProps = {
  ks: KeyStage;
};
const KeyStageFilter: FC<KeyStageFilterProps> = (props) => {
  const { ks } = props;
  const { onChange, checked } = useKeyStageToggle(ks);
  return (
    <Box $width={"50%"}>
      <Checkbox
        labelText={`KS${ks}`}
        id={`custom-checkbox-${ks}`}
        name={"keyStageFilters"}
        checked={checked}
        onChange={(checked) => onChange(checked)}
        ariaLabel={`Filter for KS${ks}`}
      />
    </Box>
  );
};

export default KeyStageFilter;
