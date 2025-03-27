import { useEffect } from "react";

import startAxe from "./startAxe";

type UseAxeProps = {
  enabled: boolean;
};
/**
 * Logs a11y issues to the console. Re-runs after mutations in the tree.
 */
const useAxe = ({ enabled }: UseAxeProps) => {
  useEffect(() => {
    if (enabled) {
      startAxe();
    }
  }, [enabled]);
};

export default useAxe;
