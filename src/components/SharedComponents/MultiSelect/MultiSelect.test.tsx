import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";

import { MultiSelect, type MultiSelectProps } from "./MultiSelect";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const groups: MultiSelectProps["groups"] = [
  {
    value: "first",
    label: "First group",
    tagBackground: "bg-decorative4-main",
    options: [
      { value: "first-one", label: "One" },
      { value: "first-two", label: "Two" },
    ],
  },
  {
    value: "second",
    label: "Second group",
    tagBackground: "bg-decorative3-main",
    options: [{ value: "second-one", label: "One" }],
  },
];

const ControlledMultiSelect = ({
  initialValues = [],
  onChange,
  ...props
}: Omit<MultiSelectProps, "groups" | "onChange" | "selectedValues"> & {
  initialValues?: string[];
  onChange?: (values: string[]) => void;
}) => {
  const [values, setValues] = useState(initialValues);
  return (
    <MultiSelect
      {...props}
      data-testid="multi-select"
      groups={groups}
      selectedValues={values}
      onChange={(nextValues) => {
        setValues(nextValues);
        onChange?.(nextValues);
      }}
    />
  );
};

describe("MultiSelect", () => {
  it("opens the desktop selector and keeps checkbox and tag state in sync", () => {
    const onChange = jest.fn();
    renderWithTheme(<ControlledMultiSelect onChange={onChange} />);

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.click(screen.getAllByRole("checkbox", { name: "One" })[0]!);

    expect(onChange).toHaveBeenLastCalledWith(["first-one"]);
    expect(
      screen.getByTestId("multi-select-remove-first-one"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("multi-select-remove-first-one"));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("uses caller-provided copy without changing selection behaviour", () => {
    const onChange = jest.fn();
    renderWithTheme(
      <ControlledMultiSelect
        onChange={onChange}
        placeholder="Choose items"
        mobileTitle="Choose items on mobile"
        selectAllLabel="Choose everything"
        unselectAllLabel="Clear everything"
        selectedItemsLabel="Chosen items"
        groupSelectLabel={(group) => `Choose every item in ${group.label}`}
        removeLabel={(option) => `Delete ${option.label}`}
      />,
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Choose every item in First group",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Choose everything" }),
    );
    expect(onChange).toHaveBeenLastCalledWith([
      "first-one",
      "first-two",
      "second-one",
    ]);

    expect(screen.getByLabelText("Chosen items")).toBeInTheDocument();
    expect(screen.getByTestId("multi-select-remove-first-one")).toHaveAttribute(
      "aria-label",
      "Delete One",
    );
    expect(
      screen.getByTestId("multi-select-remove-second-one"),
    ).toHaveAttribute("aria-label", "Delete One");

    fireEvent.click(screen.getByTestId("multi-select-trigger"));
    fireEvent.click(screen.getAllByRole("checkbox", { name: "One" })[0]!);
    expect(onChange).toHaveBeenLastCalledWith(["first-two", "second-one"]);
  });

  it("closes the desktop selector with Escape and returns focus", () => {
    renderWithTheme(<ControlledMultiSelect />);
    const trigger = screen.getByTestId("multi-select-trigger");

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("disables selection and confirmation", () => {
    renderWithTheme(<ControlledMultiSelect disabled />);

    expect(screen.getByTestId("multi-select-trigger")).toBeDisabled();
    expect(screen.getByTestId("multi-select-mobile-confirm")).toBeDisabled();
  });
});
