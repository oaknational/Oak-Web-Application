import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import { SelectedKey } from "./DropDownSelect";

import DropDownSelect from ".";


const roles = [
  { id: 1, item: "Teacher" },
  { id: 2, item: "Parent" },
  { id: 3, item: "Pupil" },
  { id: 4, item: "Other" },
];

describe("select", () => {
  it("renders a drop down select", () => {
    const value = "Teacher";
    const setSelectedKey = () => {
      console.log("press");
    };

    renderWithProviders(
      <DropDownSelect
        data-testid={"select"}
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        selectedKey={value}
        onChange={setSelectedKey}
      />
    );

    const select = screen.getByTestId("select");

    expect(select).toBeInTheDocument();
  });

  it("renders a span with selected value", () => {
    const value = "Teacher";
    const setSelectedKey = () => {
      console.log("press");
    };

    renderWithProviders(
      <DropDownSelect
        data-testid={"select"}
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        selectedKey={value}
        onChange={setSelectedKey}
      />
    );

    const buttonSpan = screen.getByTestId("select-span").textContent;

    expect(buttonSpan).toEqual("Teacher");
  });

  it("Button span value changes from keyboard controls ", async () => {
    let value: SelectedKey = "Teacher";
    const setSelectedKey = (key: SelectedKey) => {
      value = key;
    };

    const { rerender } = renderWithProviders(
      <DropDownSelect
        data-testid={"select"}
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        selectedKey={value}
        onChange={setSelectedKey}
      />
    );

    const user = userEvent.setup();

    await user.tab();
    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{Enter}");

    rerender(
      <DropDownSelect
        data-testid={"select"}
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        selectedKey={value}
        onChange={setSelectedKey}
      />
    );

    const buttonSpan = screen.getByTestId("select-span").textContent;
    expect(buttonSpan).toEqual("Parent");
  });
});
