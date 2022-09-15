import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CopyLinkButton from "./CopyLinkButton";

describe("Copy link button", () => {
  it("renders", () => {
    const { getByRole } = renderWithTheme(<CopyLinkButton />);

    expect(getByRole("button")).toBeInTheDocument();
  });

  it("updates the label", async () => {
    const { getByLabelText, rerender } = renderWithTheme(<CopyLinkButton />);

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    rerender(<CopyLinkButton />);

    const clickedButton = getByLabelText("Copied to clipboard");
    expect(clickedButton).toBeInTheDocument();
  });
});
