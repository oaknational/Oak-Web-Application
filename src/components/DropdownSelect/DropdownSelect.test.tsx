import userEvent from "@testing-library/user-event";
import { screen, fireEvent } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import DropdownSelect from ".";

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "pupil", label: "Pupil" },
  { value: "other", label: "Other" },
];

const setSelectedKey = jest.fn();
describe("select", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders a drop down select", () => {
    renderWithTheme(
      <DropdownSelect
        id="test-select"
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
    renderWithTheme(
      <DropdownSelect
        id="test-select"
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
    const { rerender } = renderWithTheme(
      <DropdownSelect
        id="test-select"
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
        id="test-select"
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

  it("renders a drop down select", () => {
    renderWithTheme(
      <DropdownSelect
        id="test-select"
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

  describe("mobile ua", () => {
    let useAgent: jest.SpyInstance;

    beforeEach(() => {
      useAgent = jest.spyOn(window.navigator, "userAgent", "get");
    });

    it("renders a native select element, which calls 'setSelectedKey' on change", async () => {
      useAgent.mockReturnValue("Android");

      const { getByLabelText } = renderWithTheme(
        <DropdownSelect
          id="test-select"
          listItems={roles}
          name={"Name"}
          placeholder={"Placeholder"}
          label={"select me"}
          onChange={setSelectedKey}
        />
      );

      const select = getByLabelText("select me");
      const options = select.querySelectorAll("option");
      fireEvent.change(select, { target: { value: "pupil" } });
      options.forEach((option) => {
        if (option.value === "pupil") {
          expect(option.selected).toBeTruthy();
        } else {
          expect(option.selected).toBeFalsy();
        }
      });

      expect(setSelectedKey).toHaveBeenCalled();
    });
  });
});
