import { KeyStage, useSearchQuery } from "./SearchContext";

const useKeyStageToggle = (ks: KeyStage) => {
  const { keyStages, setKeyStages } = useSearchQuery();

  const checked = keyStages.has(ks);

  const onChange = () => {
    const newKeyStages = new Set(keyStages);
    if (checked) {
      newKeyStages.delete(ks);
    } else {
      newKeyStages.add(ks);
    }
    setKeyStages(newKeyStages);
  };

  return {
    onChange,
    checked,
  };
};

export default useKeyStageToggle;
