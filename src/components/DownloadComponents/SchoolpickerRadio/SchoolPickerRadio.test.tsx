import { act, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import waitForNextTick from "../../../__tests__/__helpers__/waitForNextTick";
import useSchoolPicker from "../../SchoolPicker/useSchoolPicker";

import SchoolPickerRadio from "./SchoolPickerRadio";

const setSchool = jest.fn();
const props = {
  setSchool: setSchool,
  errors: {},
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("SchoolPickerRadio", () => {
  it("Renders a school picker", async () => {
    render(<SchoolPickerRadio {...props} />);

    expect(screen.getByTestId("search-combobox-input")).toBeInTheDocument();
  });

  it("Renders a radio groups", async () => {
    render(<SchoolPickerRadio {...props} />);

    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("clears school picker inputValue if radio button is clicked", async () => {
    const { getByTestId } = render(<SchoolPickerRadio {...props} />);

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Dorothy");

    expect(input).toHaveValue("Dorothy");

    const radio = getByTestId("radio-download");
    const user = userEvent.setup();
    await user.click(radio);
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    expect(radio).toBeChecked();
    expect(input).toHaveValue("");
  });

  //   /**
  //    * @todo find a way to test that the radio is cleared when school is selected
  //    */
  it.skip("clears selected radio if school is selected from school picker", async () => {
    const { getByTestId, rerender } = render(<SchoolPickerRadio {...props} />);

    const useSchoolPickerHook = renderHook(() => useSchoolPicker());

    const radio = getByTestId("radio-download");
    const user = userEvent.setup();
    await user.click(radio);
    await user.tab();

    expect(radio).toBeChecked();

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Dorothy Stringer");

    expect(input).toHaveValue("Dorothy Stringer");

    const { setSelectedSchool } = useSchoolPickerHook.result.current;
    act(() => {
      setSelectedSchool("anything");
    });

    rerender(<SchoolPickerRadio {...props} />);

    expect(radio).not.toBeChecked();
  });

  it("calls onSchoolPickerInputChange ", async () => {
    const { rerender } = render(<SchoolPickerRadio {...props} />);

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Do");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(input, "Dorothy Stringer");

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<SchoolPickerRadio {...props} />);
    expect(input.value).toBe("Dorothy Stringer");
  });
  it("calls onSchoolChange when a school is selected ", async () => {
    const { rerender } = render(<SchoolPickerRadio {...props} />);
    const useSchoolPickerHook = renderHook(() => useSchoolPicker());
    const { setSelectedSchool } = useSchoolPickerHook.result.current;
    act(() => {
      setSelectedSchool("anything");
    });

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<SchoolPickerRadio {...props} />);
    expect(setSchool).toBeCalled();
  });
});
