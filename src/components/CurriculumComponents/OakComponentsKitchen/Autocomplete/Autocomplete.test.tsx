import { useState } from "react";
import { fireEvent } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { STATES } from "./seeds";

import Autocomplete, { AutocompleteItem } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const UncontrolledWrapper = ({
  options = STATES,
  mockOnInputChange = (v: string) => {
    v;
  },
}) => {
  const [state, setState] = useState("");
  const localInputChange = (v: string) => {
    mockOnInputChange(v);
    setState(v);
  };
  return (
    <Autocomplete
      inputProps={{
        label: "Pick a state",
        id: "states",
        error: undefined,
      }}
      onChange={setState}
      onInputChange={localInputChange}
      value={state}
    >
      {options.map((state) => {
        return <AutocompleteItem key={state}>{state}</AutocompleteItem>;
      })}
    </Autocomplete>
  );
};

const ControlledWrapper = ({
  value,
  options,
  onChange,
  onInputChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string, textValue: string) => void;
  onInputChange: (v: string) => void;
}) => {
  return (
    <Autocomplete
      inputProps={{
        label: "Pick a state",
        id: "states",
        error: undefined,
      }}
      onChange={onChange}
      onInputChange={onInputChange}
      value={value}
    >
      {options.map((state) => {
        return <AutocompleteItem key={state}>{state}</AutocompleteItem>;
      })}
    </Autocomplete>
  );
};

describe("Autocomplete", () => {
  describe("uncontrolled ", () => {
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

      const labelElement = getByTestId("jaunty-label");
      expect(labelElement).toHaveTextContent("Pick a bear");
    });

    test("interactive / selecting an item", async () => {
      const mockOnInputChange = jest.fn();

      const { getByTestId, getByRole, getAllByTestId } = renderWithTheme(
        <UncontrolledWrapper mockOnInputChange={mockOnInputChange} />,
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
        <UncontrolledWrapper mockOnInputChange={mockOnInputChange} />,
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
        renderWithTheme(<UncontrolledWrapper />);

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
        <UncontrolledWrapper
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

  describe("controlled", () => {
    test("render / basic", async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <Autocomplete
          isControlled={true}
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

      const labelElement = getByTestId("jaunty-label");
      expect(labelElement).toHaveTextContent("Pick a bear");
    });

    test("interactive / selecting an item", async () => {
      const mockOnInputChange = jest.fn();
      const mockChange = jest.fn();

      const { rerender, getByTestId, getByRole, getAllByTestId } =
        renderWithTheme(
          <ControlledWrapper
            value={""}
            onInputChange={mockOnInputChange}
            onChange={mockChange}
            options={STATES}
          />,
        );
      const inputElement = getByRole("combobox");

      // Enter "Ca" into text <input/>
      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "Ca" } });
      });

      const statesWithCa = STATES.filter((s) => s.match("Ca"));

      rerender(
        <ControlledWrapper
          value={"Ca"}
          onInputChange={mockOnInputChange}
          onChange={mockChange}
          options={statesWithCa}
        />,
      );

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
      expect(mockChange).toHaveBeenCalledWith(
        "North Carolina",
        "North Carolina",
      );
    });

    test("interactive / escaping", async () => {
      const mockOnInputChange = jest.fn();
      const mockChange = jest.fn();

      const { rerender, getByTestId, getByRole } = renderWithTheme(
        <ControlledWrapper
          value={""}
          onInputChange={mockOnInputChange}
          onChange={mockChange}
          options={STATES}
        />,
      );
      const inputElement = getByRole("combobox");

      // Enter "Ca" into text <input/>
      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "Ca" } });
      });

      rerender(
        <ControlledWrapper
          value={"Ca"}
          onInputChange={mockOnInputChange}
          onChange={mockChange}
          options={STATES}
        />,
      );

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

      expect(mockOnInputChange).toHaveBeenCalledWith("");
    });

    test("interactive / updating", async () => {
      const mockOnInputChange = jest.fn();
      const mockChange = jest.fn();

      const { rerender, getByRole, getByTestId, getAllByTestId } =
        renderWithTheme(
          <ControlledWrapper
            value={""}
            onInputChange={mockOnInputChange}
            onChange={mockChange}
            options={STATES}
          />,
        );

      const inputElement = getByRole("combobox");

      // Enter "Ca" into text <input/>
      act(() => {
        inputElement.focus();
        fireEvent.change(inputElement, { target: { value: "Ca" } });
      });

      rerender(
        <ControlledWrapper
          value={"Ca"}
          onInputChange={mockOnInputChange}
          onChange={mockChange}
          options={STATES}
        />,
      );

      expect(getByTestId("listbox")).toBeInTheDocument();

      const allOptions = getAllByTestId("listbox-option");
      expect(allOptions[0]).toHaveTextContent("California");
      expect(allOptions[1]).toHaveTextContent("North Carolina");
      expect(allOptions[2]).toHaveTextContent("South Carolina");

      rerender(
        <UncontrolledWrapper
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
});
