import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import Toast from "./Toast";

import ToastProvider from "@/context/Toast/ToastProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";

describe("toast notification", () => {
  const ROLE = "alert";
  it("shows feedback", async () => {
    const { getByRole, getByLabelText, rerender } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
        <Toast />
      </ToastProvider>,
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    await waitForNextTick();

    rerender(
      <ToastProvider>
        <Toast />
      </ToastProvider>,
    );

    expect(getByRole(ROLE)).toHaveTextContent("Copied to clipboard");
  });
});
