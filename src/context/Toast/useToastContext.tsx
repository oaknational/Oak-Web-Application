import { useContext } from "react";

import { toastContext } from "./ToastProvider";

const useToastContext = () => {
  const toastValue = useContext(toastContext);

  if (!toastValue) {
    throw new Error("useToastContext() called outside of toast provider");
  }

  return toastValue;
};

export default useToastContext;
