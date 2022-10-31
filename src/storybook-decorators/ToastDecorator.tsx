import { Story } from "@storybook/react";
import { useState } from "react";

import { toastContext, ToastRole } from "../context/Toast/ToastProvider";
import noop from "../__tests__/__helpers__/noop";

export default function ToastDecorator(Story: Story) {
  const [state] = useState({
    message: "Something important but fleeting",
    shown: false,
    role: "status" as ToastRole,
    showToast: noop,
    hideToast: noop,
  });

  return (
    <div>
      <toastContext.Provider value={state}>
        <Story />
      </toastContext.Provider>
    </div>
  );
}
