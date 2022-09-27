import { useContext } from "react";

import { toastContext } from "./ToastProvider";

export const SHOW_DURATION = 3500;

const useToastContext = () => {
  const toastValue = useContext(toastContext);

  if (!toastValue) {
    throw new Error("useToastContext() called outside of menu provider");
  }

  return toastValue;
};

export default useToastContext;
