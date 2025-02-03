import userEvent from "@testing-library/user-event";

import CopyLinkButton from "./CopyLinkButton";

import { ToastProvider } from "@/context/Toast";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Copy link button", () => {
  it("renders", () => {
    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>,
    );

    expect(getByRole("button")).toBeInTheDocument();
  });

  it("updates the title", async () => {
    const { getByLabelText, rerender } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>,
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy link to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    rerender(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>,
    );

    const clickedButton = getByLabelText("Link copied to clipboard");
    expect(clickedButton).toBeInTheDocument();
  });

  it("copies the current URL to the clipboard by default", async () => {
    const { getByLabelText } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>,
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy link to clipboard");
    await user.click(button);

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost:3000/");
  });

  it("copies the provided URL to the clipboard", async () => {
    const { getByLabelText } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton href="https://example.com" />
      </ToastProvider>,
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy link to clipboard");
    await user.click(button);

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("https://example.com");
  });
  it("has aria-live polite", async () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>,
    );
    const user = userEvent.setup();

    const button = getByLabelText("Copy link to clipboard");
    await user.click(button);

    const anouncement = getByText("Link copied to clipboard");
    expect(anouncement).toBeInTheDocument();
    expect(anouncement).toHaveAttribute("aria-live", "polite");
  });
});
