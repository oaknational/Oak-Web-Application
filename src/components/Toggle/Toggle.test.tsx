import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders a Toggle", () => {
    renderWithTheme(
      <Toggle
        checked={true}
        labelOn="label"
        labelOff="label"
        onChange={jest.fn()}
      />,
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
  });

  it("renders a label", () => {
    renderWithTheme(
      <Toggle
        checked={true}
        labelOn="label on"
        labelOff="label"
        onChange={jest.fn()}
      />,
    );

    const label = screen.getByText("label on");

    expect(label).toBeInTheDocument();
  });

  it("changes on click of label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        onChange={() => toggleValue()}
      />,
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
      />,
    );

    expect(input).toBeChecked();
  });
  it("can be disabled and enabled", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <Toggle
        labelOn="label on"
        labelOff="label"
        checked={value}
        disabled={true}
        onChange={() => toggleValue()}
      />,
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
      />,
    );

    expect(input).toHaveProperty("disabled", false);
  });
});
