import userEvent from "@testing-library/user-event";

import { ToastProvider } from "../../../context/Toast";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CopyLinkButton from "./CopyLinkButton";

describe("Copy link button", () => {
  it("renders", () => {
    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    expect(getByRole("button")).toBeInTheDocument();
  });

  it("updates the label", async () => {
    const { getByLabelText, rerender } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    rerender(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    const clickedButton = getByLabelText("Copied to clipboard");
    expect(clickedButton).toBeInTheDocument();
  });

  it("copies the current URL to the clipboard by default", async () => {
    const { getByLabelText } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    await user.click(button);

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost/");
  });

  it("copies the provided URL to the clipboard", async () => {
    const { getByLabelText } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton href="https://example.com" />
      </ToastProvider>
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    await user.click(button);

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("https://example.com");
  });
});
