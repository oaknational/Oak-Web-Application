import { Story } from "@storybook/react";

import { toastContext, ToastRole } from "../context/Toast/ToastProvider";
import noop from "../__tests__/__helpers__/noop";

export default function ToastDecorator(Story: Story) {
  const value = {
    message: "Something important but fleeting",
    shown: false,
    role: "status" as ToastRole,
    showToast: noop,
    hideToast: noop,
  };

  return (
    <toastContext.Provider value={value}>
      <Story />
    </toastContext.Provider>
  );
}
