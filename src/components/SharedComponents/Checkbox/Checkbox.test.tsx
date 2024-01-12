import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Checkbox from "./Checkbox";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Checkbox", () => {
  it("renders a checkbox with a label text", () => {
    renderWithTheme(
      <Checkbox
        id="unique-123"
        name="terms"
        checked
        labelText="Agree to terms"
        onChange={vi.fn()}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.getAttribute("name")).toEqual("terms");
    expect(checkbox.getAttribute("id")).toEqual("unique-123");
    expect(checkbox.getAttribute("checked")).toEqual("");

    expect(checkbox).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithTheme(
      <Checkbox
        id="unique-123"
        name="terms"
        checked
        labelText="Agree to terms"
        onChange={vi.fn()}
      />,
    );

    const label = screen.getByText("Agree to terms");

    expect(label).toBeInTheDocument();
  });

  it("changes on click on label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <Checkbox
        id="unique-123"
        name="terms"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />,
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input.getAttribute("checked")).toEqual(null);
    expect(input).not.toBeChecked();

    const label = screen.getByText("Agree to terms");
    await user.click(label);

    rerender(
      <Checkbox
        id="unique-123"
        name="terms"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />,
    );

    expect(input).toBeChecked();
  });

  it("it can't be changed if disabled", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <Checkbox
        id="unique-123"
        name="terms"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
        disabled
      />,
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    await user.tab();
    await user.keyboard(" ");

    rerender(
      <Checkbox
        id="unique-123"
        name="terms"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
        disabled
      />,
    );

    expect(input).not.toBeChecked();
  });

  it("changes on keyboard input", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <Checkbox
        name="terms"
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />,
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    await user.tab();
    await user.keyboard(" ");

    rerender(
      <Checkbox
        name="terms"
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />,
    );

    expect(input).toBeChecked();
  });

  it("has a label associated with it", () => {
    renderWithTheme(
      <Checkbox
        name="terms"
        id="unique-123"
        checked
        labelText="Agree to terms"
        onChange={vi.fn()}
      />,
    );

    const checkboxElement = screen.getByLabelText("Agree to terms");
    expect(checkboxElement.tagName).toEqual("INPUT");
    expect(checkboxElement.getAttribute("type")).toEqual("checkbox");
  });

  it("renders children as label is resourceType is cardCheckbox", () => {
    renderWithTheme(
      <Checkbox
        name="downloadResources"
        id="unique-123"
        checked
        onChange={vi.fn()}
        variant="withoutLabel"
      >
        <p>Test download resource</p>
      </Checkbox>,
    );

    const label = screen.getByText("Test download resource");
    expect(label).toBeInTheDocument();
  });
});
