import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import KeyStageFilter from "./SearchFilterCheckbox";

const props = {
  slug: "ks1",
  title: "Key-stage 1",
  shortCode: "KS1",
  onChange: jest.fn(),
  checked: false,
};

describe("KeyStageFilter", () => {
  test("has the correct id", () => {
    const { getByRole } = renderWithTheme(<KeyStageFilter {...props} />);
    const checkbox = getByRole("checkbox");
    expect(checkbox.id).toEqual("custom-checkbox-ks1");
  });
  test("has the correct name", () => {
    const { getByRole } = renderWithTheme(<KeyStageFilter {...props} />);
    const checkbox = getByRole("checkbox");
    expect(checkbox.getAttribute("name")).toEqual("keyStageFilters");
  });
  test("respects checked value: true", () => {
    const { getByRole } = renderWithTheme(<KeyStageFilter {...props} />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
  test("respects checked value: false", () => {
    const { getByRole } = renderWithTheme(
      <KeyStageFilter {...props} checked={true} />
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test.todo("calls onChange when clicked");
});
