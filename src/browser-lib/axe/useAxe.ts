import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import isBrowser from "../../utils/isBrowser";

const axeConfig = {
  rules: [
    {
      id: "skip-link",
      enabled: true,
    },
  ],
  disableDeduplicate: true,
};
const axeContext = {
  exclude: [
    // Gleap
    [".bb-logo-logo"],
  ],
};

const startAxe = async () => {
  if (isBrowser) {
    const axe = (await import("@axe-core/react")).default;
    axe(React, ReactDOM, 1000, axeConfig, axeContext);
  }
};

type UseAxeProps = {
  enabled: boolean;
};
/**
 * Logs a11y issues to the console. Re-runs after mutations in the tree.
 */
const useAxe = async ({ enabled }: UseAxeProps) => {
  useEffect(() => {
    if (enabled) {
      startAxe();
    }
  }, [enabled]);
};

export default useAxe;
