import { useRouter } from "next/router";

import { KeyStage, useSearchQuery } from "./SearchContext";

const useKeyStageToggle = (ks: KeyStage) => {
  const { keyStages, setKeyStages } = useSearchQuery();
  const router = useRouter();

  const checked = keyStages.has(ks);

  const onChange = () => {
    const newKeyStages = new Set(keyStages);
    if (checked) {
      newKeyStages.delete(ks);
    } else {
      newKeyStages.add(ks);
    }
    setKeyStages(newKeyStages);

    // shallow push with new params
    const chosenKeyStagesArray = Array.from(newKeyStages);
    const chosenKeyStagesString = chosenKeyStagesArray.join(",");
    router.query.keystages = chosenKeyStagesString;
    router.push(router, undefined, { shallow: true });
  };

  return {
    onChange,
    checked,
  };
};

export default useKeyStageToggle;
