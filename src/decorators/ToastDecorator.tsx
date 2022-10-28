import { Story } from "@storybook/react";
import { FC, useState } from "react";

import { toastContext, ToastRole } from "../context/Toast/ToastProvider";

export default function ToastDecorator(Story: Story | FC) {
  const [state] = useState({
    message: "Something important but fleeting",
    shown: false,
    role: "status" as ToastRole,
    /* eslint-disable @typescript-eslint/no-empty-function */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showToast: (message: string, role: ToastRole) => {},
    hideToast: () => {},
    /* eslint-enable @typescript-eslint/no-empty-function */
  });

  return (
    <div>
      <toastContext.Provider value={state}>
        <Story />
      </toastContext.Provider>
    </div>
  );
}
