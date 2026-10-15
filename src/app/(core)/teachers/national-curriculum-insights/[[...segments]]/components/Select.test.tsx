import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { NationalCurriculumInsightsSelect } from "./Select";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const options = [
  { label: "Class teacher", value: "teacher" },
  { label: "School leader", value: "leader" },
];

const Field = ({ error }: { error?: string }) => {
  const [value, setValue] = useState("");
  return (
    <NationalCurriculumInsightsSelect
      id="test-role"
      name="role"
      label="Your role"
      placeholder="Choose a role"
      options={options}
      value={value}
      onChange={setValue}
      error={error}
    />
  );
};

describe("Insights Oak select", () => {
  it("renders only options inside the select to preserve valid hydration markup", () => {
    renderWithTheme(<Field />);
    const select = screen.getByRole("combobox", { name: "Your role" });

    expect(Array.from(select.children, (child) => child.tagName)).toEqual([
      "OPTION",
      "OPTION",
      "OPTION",
    ]);
  });

  it("uses a labelled native select with supplied option values", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Field />);
    const select = screen.getByRole("combobox", { name: "Your role" });
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("");
    expect(
      screen.getByRole("option", { name: "Choose a role" }),
    ).toBeDisabled();
    await user.selectOptions(select, "leader");
    expect(screen.getByRole("combobox", { name: "Your role" })).toHaveValue(
      "leader",
    );
    expect(
      screen.getByRole("option", { name: "School leader" }),
    ).toHaveAttribute("value", "leader");
  });

  it("does not leave the surrounding form inert after selection", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    renderWithTheme(
      <>
        <Field />
        <button onClick={onClick}>Continue</button>
      </>,
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Your role" }),
      "teacher",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[inert]")).toBeNull();
  });

  it("associates a visible error with the field group and announces it", () => {
    renderWithTheme(<Field error="Choose a role to continue" />);
    expect(
      screen.getByRole("group", { name: "Your role" }),
    ).toHaveAccessibleDescription("Error Choose a role to continue");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a role to continue",
    );
  });
});
