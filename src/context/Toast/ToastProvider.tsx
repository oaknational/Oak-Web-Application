import { createContext, FC, useCallback, useState } from "react";

export type ToastRole = "alert" | "status";

type ToastContext = {
  message: string;
  shown: boolean;
  role: ToastRole;
  showToast: (message: string, role: ToastRole) => void;
  hideToast: () => void;
};

export const toastContext = createContext<ToastContext | null>(null);

export const ToastProvider: FC = ({ children }) => {
  const [message, setMessage] = useState("");
  const [shown, setShown] = useState(false);
  const [role, setRole] = useState<ToastRole>("status");

  const showToast = useCallback(
    (message, role) => {
      setMessage(message);
      setRole(role);
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
    role,
    showToast,
    hideToast,
  };

  return (
    <toastContext.Provider value={toastValue}>{children}</toastContext.Provider>
  );
};

export default ToastProvider;
