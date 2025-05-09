import { useContext } from "react";

import { oakToastContext } from "./OakToastProvider";

export const useOakToastContext = () => {
  const oakToastValue = useContext(oakToastContext);

  if (!oakToastValue) {
    throw new Error("useOakToastContext() called outside of OakToastProvider");
  }

  return oakToastValue;
};
