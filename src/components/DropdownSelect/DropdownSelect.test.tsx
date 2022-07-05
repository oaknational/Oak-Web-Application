import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import DropdownSelect from ".";

const roles = [
  { value: "1", label: "Teacher" },
  { value: "2", label: "Parent" },
  { value: "3", label: "Pupil" },
  { value: "4", label: "Other" },
];

const setSelectedKey = () => {
  console.log("press");
};
describe("select", () => {
  it("renders a drop down select", () => {
    renderWithProviders(
      <DropdownSelect
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        onChange={setSelectedKey}
      />
    );

    const select = screen.getByTestId("select");

    expect(select).toBeInTheDocument();
  });

  it("renders a span with selected value", async () => {
    renderWithProviders(
      <DropdownSelect
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        onChange={setSelectedKey}
      />
    );

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{Enter}");

    const buttonSpan = screen.getByTestId("select-span").textContent;

    expect(buttonSpan).toEqual("Parent");
  });

  it("Button span value changes from keyboard controls ", async () => {
    const { rerender } = renderWithProviders(
      <DropdownSelect
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        onChange={setSelectedKey}
      />
    );

    const user = userEvent.setup();

    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{Enter}");

    rerender(
      <DropdownSelect
        listItems={roles}
        name={"Name"}
        placeholder={"Placeholder"}
        label={"select me"}
        onChange={setSelectedKey}
      />
    );

    const buttonSpan = screen.getByTestId("select-span").textContent;
    expect(buttonSpan).toEqual("Parent");
  });
});
