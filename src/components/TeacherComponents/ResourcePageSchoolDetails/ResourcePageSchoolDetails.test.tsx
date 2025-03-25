import { act, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ResourcePageSchoolDetails from "./ResourcePageSchoolDetails";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";

const setSchool = jest.fn();
const props = {
  setSchool: setSchool,
  errors: {},
  withHomeschool: true,
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("ResourcePageSchoolDetails", () => {
  it("Renders a school picker", async () => {
    render(<ResourcePageSchoolDetails {...props} />);

    expect(screen.getByTestId("search-combobox-input")).toBeInTheDocument();
  });

  it("Renders a checkbox", async () => {
    render(<ResourcePageSchoolDetails {...props} />);

    await act(async () => {
      const checkbox = screen.getAllByRole("checkbox");

      expect(checkbox).toHaveLength(1);
    });
  });

  it("clears school picker inputValue if checkbox is clicked", async () => {
    const { getByRole } = render(<ResourcePageSchoolDetails {...props} />);

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
    expect(input).toHaveValue("");
  });

  it("clears selected checkbox if school is selected from school picker", async () => {
    const { getByRole, rerender } = render(
      <ResourcePageSchoolDetails {...props} />,
    );

    const { result } = renderHook(() =>
      useSchoolPicker({ withHomeschool: true }),
    );

    await act(async () => {
      const checkbox = getByRole("checkbox");
      checkbox.click();
      expect(checkbox).toBeChecked();
    });

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Dorothy Bricks");

    expect(input).toHaveValue("Dorothy Bricks");

    act(() => {
      result.current.setSelectedSchool("anything");
    });

    rerender(<ResourcePageSchoolDetails {...props} />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("calls onSchoolPickerInputChange ", async () => {
    const { rerender } = render(<ResourcePageSchoolDetails {...props} />);

    const input: HTMLInputElement = screen.getByTestId("search-combobox-input");
    await userEvent.type(input, "Do");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(input, "Dorothy Bricks");

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<ResourcePageSchoolDetails {...props} />);
    expect(input.value).toBe("Dorothy Bricks");
  });
  it("calls onSchoolChange when a school is selected ", async () => {
    const { rerender } = render(<ResourcePageSchoolDetails {...props} />);
    const useSchoolPickerHook = renderHook(() =>
      useSchoolPicker({ withHomeschool: true }),
    );
    const { setSelectedSchool } = useSchoolPickerHook.result.current;
    act(() => {
      setSelectedSchool("anything");
    });

    // HACK: wait for next tick
    await waitForNextTick();
    rerender(<ResourcePageSchoolDetails {...props} />);
    expect(setSchool).toBeCalled();
  });
});
