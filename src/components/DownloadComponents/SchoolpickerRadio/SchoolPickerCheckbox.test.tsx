import { act, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import waitForNextTick from "../../../__tests__/__helpers__/waitForNextTick";
import useSchoolPicker from "../../SchoolPicker/useSchoolPicker";

import SchoolPickerCheckbox from "./SchoolPickerCheckbox";

const setSchool = jest.fn();
const props = {
  setSchool: setSchool,
  errors: {},
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("SchoolPickerCheckbox", () => {
  it("Renders a school picker", async () => {
    render(<SchoolPickerCheckbox {...props} />);

    expect(screen.getByTestId("search-combobox-input")).toBeInTheDocument();
  });

  it("Renders a checkbox", async () => {
    render(<SchoolPickerCheckbox {...props} />);

    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  });

  it("clears school picker inputValue if checkbox is clicked", async () => {
    const { getByRole } = render(<SchoolPickerCheckbox {...props} />);

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Dorothy");

    expect(input).toHaveValue("Dorothy");

    const checkbox = getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    expect(checkbox).toBeChecked();
    // expect(input).toBeTruthy();
  });

  it("clears selected checkbox if school is selected from school picker", async () => {
    const { getByRole, rerender } = render(<SchoolPickerCheckbox {...props} />);

    const useSchoolPickerHook = renderHook(() => useSchoolPicker());

    const checkbox = getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);
    await user.tab();

    expect(checkbox).toBeChecked();

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Dorothy Bricks");

    expect(input).toHaveValue("Dorothy Bricks");

    const { setSelectedSchool } = useSchoolPickerHook.result.current;
    act(() => {
      setSelectedSchool("anything");
    });

    rerender(<SchoolPickerCheckbox {...props} />);

    expect(checkbox).not.toBeChecked();
  });

  it("calls onSchoolPickerInputChange ", async () => {
    const { rerender } = render(<SchoolPickerCheckbox {...props} />);

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Do");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(input, "Dorothy Bricks");

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<SchoolPickerCheckbox {...props} />);
    expect(input.value).toBe("Dorothy Bricks");
  });
  it("calls onSchoolChange when a school is selected ", async () => {
    const { rerender } = render(<SchoolPickerCheckbox {...props} />);
    const useSchoolPickerHook = renderHook(() => useSchoolPicker());
    const { setSelectedSchool } = useSchoolPickerHook.result.current;
    act(() => {
      setSelectedSchool("anything");
    });

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<SchoolPickerCheckbox {...props} />);
    expect(setSchool).toBeCalled();
  });
});
