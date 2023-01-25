import { FC } from "react";

import { KeyStage } from "../../context/Search/SearchContext";
import useKeyStageToggle from "../../context/Search/useKeyStageToggle";
import CheckboxButton from "../Checkbox";

type KeyStageFilterProps = {
  ks: KeyStage;
};
const KeyStageFilter: FC<KeyStageFilterProps> = (props) => {
  const { ks } = props;
  const { onChange, checked } = useKeyStageToggle(ks);
  return (
    <div>
      <CheckboxButton
        labelText={`KS${ks}`}
        id={`custom-checkbox-${ks}`}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default KeyStageFilter;
