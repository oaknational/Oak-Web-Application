import { FC } from "react";

import { KeyStage } from "../../context/Search/SearchContext";
import useKeyStageToggle from "../../context/Search/useKeyStageToggle";
import Checkbox from "../Checkbox/Checkbox";

type KeyStageFilterProps = {
  ks: KeyStage;
};
const KeyStageFilter: FC<KeyStageFilterProps> = (props) => {
  const { ks } = props;
  const { onChange, checked } = useKeyStageToggle(ks);
  return (
    <Checkbox
      labelText={`Key Stage ${ks}`}
      id={`custom-checkbox-${ks}`}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default KeyStageFilter;
