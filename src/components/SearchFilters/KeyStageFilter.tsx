import { FC } from "react";

import { KeyStage } from "../../context/Search/SearchContext";
import useKeyStageToggle from "../../context/Search/useKeyStageToggle";

type KeyStageFilterProps = {
  ks: KeyStage;
};
const KeyStageFilter: FC<KeyStageFilterProps> = (props) => {
  const { ks } = props;
  const { onChange, checked } = useKeyStageToggle(ks);
  return (
    <label>
      Key Stage {ks}
      <input
        type="checkbox"
        id={`custom-checkbox-${ks}`}
        name={ks}
        value={ks}
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};

export default KeyStageFilter;
