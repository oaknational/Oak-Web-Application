import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders a Toggle", () => {
    renderWithProviders(
      <Toggle
        checked={true}
        labelOn="label"
        labelOff="label"
        onChange={() => console.log("on change")}
      />
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithProviders(
      <Toggle
        checked={true}
        labelOn="label on"
        labelOff="label"
        onChange={() => console.log("on change")}
      />
    );

    const label = screen.getByText("label on");

    expect(label).toBeInTheDocument();
  });

  it("changes on click of label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithProviders(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    const label = screen.getByText("label on");
    await user.click(label);

    rerender(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        onChange={() => toggleValue()}
      />
    );

    expect(input).toBeChecked();
  });
  it("can be disabled and enabled", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithProviders(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        disabled={true}
        onChange={() => toggleValue()}
      />
    );

    const input = screen.getByRole("checkbox");
    expect(input).toHaveProperty("disabled", true);

    rerender(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        disabled={false}
        onChange={() => toggleValue()}
      />
    );

    expect(input).toHaveProperty("disabled", false);
  });
});
