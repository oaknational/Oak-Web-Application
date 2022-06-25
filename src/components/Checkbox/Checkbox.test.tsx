import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    renderWithProviders(
      <Checkbox
        id="unique-123"
        checked
        labelText="Agree to terms"
        onChange={() => {
          console.log("on change");
        }}
      />
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithProviders(
      <Checkbox
        id="unique-123"
        checked
        labelText="Agree to terms"
        onChange={() => {
          console.log("on change");
        }}
      />
    );

    const label = screen.getByText("Agree to terms");

    expect(label).toBeInTheDocument();
  });

  it("changes on click on label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithProviders(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    const label = screen.getByText("Agree to terms");
    await user.click(label);

    rerender(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    expect(input).toBeChecked();
  });

  it("it can't be changed if disabled", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithProviders(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
        disabled
      />
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    await user.tab();
    await user.keyboard(" ");

    rerender(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
        disabled
      />
    );

    expect(input).not.toBeChecked();
  });

  it("changes on keyboard input", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithProviders(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    await user.tab();
    await user.keyboard(" ");

    rerender(
      <Checkbox
        id="unique-123"
        labelText="Agree to terms"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    expect(input).toBeChecked();
  });

  it("has a label associated with it", () => {
    renderWithProviders(
      <Checkbox
        id="unique-123"
        checked
        labelText="Agree to terms"
        onChange={() => {
          console.log("on change");
        }}
      />
    );

    const checkboxElement = screen.getByLabelText("Agree to terms");
    expect(checkboxElement.tagName).toEqual("INPUT");
    expect(checkboxElement.getAttribute("type")).toEqual("checkbox");
  });
});
