import { useContext } from "react";

import { toastContext } from "./ToastProvider";

const useToastContext = () => {
  const toastValue = useContext(toastContext);

  if (!toastValue) {
    throw new Error("useToastContext() called outside of menu provider");
  }

  return toastValue;
};

export default useToastContext;
