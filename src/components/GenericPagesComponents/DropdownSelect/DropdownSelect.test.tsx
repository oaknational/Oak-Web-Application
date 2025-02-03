import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import DropdownSelect from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "pupil", label: "Pupil" },
  { value: "other", label: "Other" },
];

const setSelectedKey = vi.fn();
describe("select", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
    );

    const select = screen.getByTestId("select");

    expect(select).toBeInTheDocument();
  });
});
