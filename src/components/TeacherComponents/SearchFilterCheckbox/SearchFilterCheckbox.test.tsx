import SearchFilterCheckbox from "./SearchFilterCheckbox";

import { FilterType } from "@/browser-lib/avo/Avo";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const props = {
  slug: "ks1",
  title: "Key-stage 1",
  label: "KS1",
  onChange: jest.fn(),
  checked: false,
  name: "Key stage",
  filterType: FilterType.KEY_STAGE_FILTER,
  searchRefined: jest.fn(),
};

describe("SearchFilterCheckbox", () => {
  test("has the correct id", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilterCheckbox
        {...props}
        lastFocussedFilter={null}
        onFilterClick={jest.fn()}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox.id).toEqual("custom-checkbox-ks1");
  });
  test("has the correct name", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilterCheckbox
        {...props}
        lastFocussedFilter={null}
        onFilterClick={jest.fn()}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox.getAttribute("name")).toEqual("Key stage");
  });
  test("respects checked value: true", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilterCheckbox
        {...props}
        lastFocussedFilter={null}
        onFilterClick={jest.fn()}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
  test("respects checked value: false", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilterCheckbox
        {...props}
        checked={true}
        lastFocussedFilter={null}
        onFilterClick={jest.fn()}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test.todo("calls onChange when clicked");
});
