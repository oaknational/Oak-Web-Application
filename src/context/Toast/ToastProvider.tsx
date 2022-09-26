import { createContext, FC, useCallback, useState } from "react";

type ToastContext = {
  message: string;
  shown: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
};

export const toastContext = createContext<ToastContext | null>(null);

export const ToastProvider: FC = ({ children }) => {
  const [message, setMessage] = useState("");
  const [shown, setShown] = useState(false);

  const showToast = useCallback(
    (message) => {
      setMessage(message);
      setShown(true);
    },
    [setShown]
  );

  const hideToast = useCallback(() => {
    setShown(false);
  }, [setShown]);

  const toastValue: ToastContext = {
    message,
    shown,
    showToast,
    hideToast,
  };

  return (
    <toastContext.Provider value={toastValue}>{children}</toastContext.Provider>
  );
};

export default ToastProvider;
