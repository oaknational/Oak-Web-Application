import userEvent from "@testing-library/user-event";

import ToastProvider from "../../context/Toast/ToastProvider";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import CopyLinkButton from "../Button/CopyLinkButton";

import Toast from "./Toast";

const shareData = {
  shareTitle: "Title of an article to share",
  shareText: "Some summary text",
};

describe("toast notification", () => {
  const ROLE = "alert";
  test("shows feedback", async () => {
    const { getByRole, getByLabelText, rerender } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton {...shareData} />
        <Toast />
      </ToastProvider>
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    rerender(
      <ToastProvider>
        <Toast />
      </ToastProvider>
    );

    expect(getByRole(ROLE)).toHaveTextContent("Copied to clipboard");
  });
});
