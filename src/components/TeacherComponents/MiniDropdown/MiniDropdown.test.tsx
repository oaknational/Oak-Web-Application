import userEvent from "@testing-library/user-event";

import MiniDropdown from "./MiniDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("MiniDropdown", () => {
  test("renders dropdown with label", () => {
    const { getByRole } = renderWithTheme(
      <MiniDropdown label="Test Dropdown">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      "aria-label",
      "Test Dropdown dropdown, collapsed",
    );
  });

  test("shows content when opened", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderWithTheme(
      <MiniDropdown label="Test Dropdown">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    await user.click(button);

    expect(getByText("Dropdown content")).toBeInTheDocument();
    expect(button).toHaveAttribute(
      "aria-label",
      "Test Dropdown dropdown, expanded",
    );
  });

  test("hides content when collapsed", async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText } = renderWithTheme(
      <MiniDropdown label="Test Dropdown" defaultOpen>
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    expect(queryByText("Dropdown content")).toBeInTheDocument();

    await user.click(button);
    expect(queryByText("Dropdown content")).not.toBeVisible();
  });

  test("supports keyboard navigation with Enter key", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderWithTheme(
      <MiniDropdown label="Test Dropdown">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(getByText("Dropdown content")).toBeInTheDocument();
  });

  test("supports keyboard navigation with Space key", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderWithTheme(
      <MiniDropdown label="Test Dropdown">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    button.focus();
    await user.keyboard(" ");

    expect(getByText("Dropdown content")).toBeInTheDocument();
  });

  test("calls onToggle callback when toggled", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <MiniDropdown label="Test Dropdown" onToggle={onToggle}>
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    await user.click(button);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  test("works in controlled mode", () => {
    const { getByRole, getByText } = renderWithTheme(
      <MiniDropdown label="Test Dropdown" isToggleOpen={true}>
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "Test Dropdown dropdown, expanded",
    );
    expect(getByText("Dropdown content")).toBeInTheDocument();
  });

  test("uses custom id when provided", () => {
    const { getByRole } = renderWithTheme(
      <MiniDropdown label="Test Dropdown" id="custom-dropdown">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute("aria-controls", "custom-dropdown-content");
  });

  test("generates id from label when no id provided", () => {
    const { getByRole } = renderWithTheme(
      <MiniDropdown label="Test Dropdown Label">
        <div>Dropdown content</div>
      </MiniDropdown>,
    );

    const button = getByRole("button");
    expect(button).toHaveAttribute(
      "aria-controls",
      "mini-dropdown-test-dropdown-label-content",
    );
  });
});
