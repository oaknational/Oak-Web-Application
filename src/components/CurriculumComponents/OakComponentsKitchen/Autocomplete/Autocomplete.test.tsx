import { useState } from "react";
import { fireEvent } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

import { STATES } from "./seeds";

import Autocomplete, { AutocompleteItem } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const Wrapper = ({ options = STATES, mockOnInputChange = () => {} }) => {
  const [state, setState] = useState("");
  return (
    <Autocomplete
      inputProps={{
        label: "Pick a state",
        id: "states",
        error: undefined,
      }}
      onChange={setState}
      onInputChange={mockOnInputChange}
      value={state}
    >
      {options.map((state) => {
        return <AutocompleteItem key={state}>{state}</AutocompleteItem>;
      })}
    </Autocomplete>
  );
};

describe("Autocomplete", () => {
  test("render / basic", async () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <Autocomplete
        inputProps={{
          label: "Pick a bear",
          id: "bears",
          name: "bears",
          error: undefined,
        }}
        onChange={() => {}}
        value={"Black Bear"}
      >
        {STATES.map((state) => {
          return <AutocompleteItem key={state}>{state}</AutocompleteItem>;
        })}
      </Autocomplete>,
    );

    const inputElement = getByRole("combobox");
    expect(inputElement).toHaveValue("Black Bear");

    const labelElement = getByTestId("rotated-input-label");
    expect(labelElement).toHaveTextContent("Pick a bear");
  });

  test("interactive / selecting an item", async () => {
    const mockOnInputChange = jest.fn();

    const { getByTestId, getByRole, getAllByTestId } = renderWithTheme(
      <Wrapper mockOnInputChange={mockOnInputChange} />,
    );
    const inputElement = getByRole("combobox");

    // Enter "Ca" into text <input/>
    act(() => {
      inputElement.focus();
      fireEvent.change(inputElement, { target: { value: "Ca" } });
    });
    expect(mockOnInputChange).toHaveBeenCalledWith("Ca");

    const listBoxElement = getByTestId("listbox");
    expect(listBoxElement).toBeInTheDocument();

    const allOptions = getAllByTestId("listbox-option");
    expect(allOptions[0]).toHaveTextContent("California");
    expect(allOptions[1]).toHaveTextContent("North Carolina");
    expect(allOptions[2]).toHaveTextContent("South Carolina");

    // Select 2nd option
    act(() => {
      fireEvent.click(allOptions[1]!);
    });
    expect(inputElement).toHaveValue("North Carolina");
  });

  test("interactive / escaping", async () => {
    const mockOnInputChange = jest.fn();

    const { getByTestId, getByRole } = renderWithTheme(
      <Wrapper mockOnInputChange={mockOnInputChange} />,
    );
    const inputElement = getByRole("combobox");

    // Enter "Ca" into text <input/>
    act(() => {
      inputElement.focus();
      fireEvent.change(inputElement, { target: { value: "Ca" } });
    });

    expect(mockOnInputChange).toHaveBeenCalledWith("Ca");

    const listBoxElement = getByTestId("listbox");
    expect(listBoxElement).toBeInTheDocument();

    // Press ESC
    act(() => {
      fireEvent.keyDown(inputElement, {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(inputElement).toHaveValue("");
  });

  test("interactive / updating", async () => {
    const { rerender, getByRole, getByTestId, getAllByTestId } =
      renderWithTheme(<Wrapper />);

    const inputElement = getByRole("combobox");

    // Enter "Ca" into text <input/>
    act(() => {
      inputElement.focus();
      fireEvent.change(inputElement, { target: { value: "Ca" } });
    });

    expect(getByTestId("listbox")).toBeInTheDocument();

    const allOptions = getAllByTestId("listbox-option");
    expect(allOptions[0]).toHaveTextContent("California");
    expect(allOptions[1]).toHaveTextContent("North Carolina");
    expect(allOptions[2]).toHaveTextContent("South Carolina");

    rerender(
      <Wrapper
        options={["Boxfish", "Cat", "Cave Bear", "Caterpillar", "Damselfish"]}
      />,
    );

    // Enter "Ca" into text <input/>
    act(() => {
      const inputElement = getByRole("combobox");
      inputElement.focus();
      fireEvent.change(inputElement, { target: { value: "Ca" } });
    });

    expect(getByTestId("listbox")).toBeInTheDocument();

    const allOptions2 = getAllByTestId("listbox-option");
    expect(allOptions2[0]).toHaveTextContent("Cat");
    expect(allOptions2[1]).toHaveTextContent("Cave Bear");
    expect(allOptions2[2]).toHaveTextContent("Caterpillar");
  });
});
