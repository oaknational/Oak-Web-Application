import { createContext, FC, useCallback, useState } from "react";

type ToastContext = {
  message: string;
  shown: boolean;
  showToast: (message: string) => void;
};

export const toastContext = createContext<ToastContext | null>(null);

const SHOW_DURATION = 500;

export const ToastProvider: FC = ({ children }) => {
  const [message, setMessage] = useState("");
  const [shown, setShown] = useState(false);

  const showToast = useCallback(
    (message) => {
      setMessage(message);
      setShown(true);
      setTimeout(() => {
        setShown(false);
      }, SHOW_DURATION);
    },
    [setShown]
  );

  const toastValue: ToastContext = {
    message,
    shown,
    showToast,
  };

  return (
    <toastContext.Provider value={toastValue}>{children}</toastContext.Provider>
  );
};

export default ToastProvider;
