import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SearchFilters from "./SearchFilters";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const ks4OnChange = jest.fn();
const ks3OnChange = jest.fn();
const keyStageFilters = [
  {
    title: "Key-stage 4",
    slug: "ks4",
    shortCode: "KS4",
    onChange: ks4OnChange,
    checked: false,
  },
  {
    title: "Key-stage 3",
    slug: "ks3",
    shortCode: "KS3",
    onChange: ks3OnChange,
    checked: false,
  },
];

describe("SearchFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders all the key stage filters", () => {
    const { getAllByRole } = renderWithTheme(
      <SearchFilters keyStageFilters={keyStageFilters} />
    );
    const searchFilters = getAllByRole("checkbox");
    expect(searchFilters).toHaveLength(keyStageFilters.length);
  });
  test("have correct a11y label", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters keyStageFilters={keyStageFilters} />
    );
    const ks3Filter = getByRole("checkbox", {
      name: "Toggle Key-stage 3 filter",
    });
    expect(ks3Filter).toBeInTheDocument();
  });
  test("respect 'checked' attribute when filter active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={keyStageFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
      />
    );
    const ks3Filter = getByRole("checkbox", {
      name: "Toggle Key-stage 3 filter",
    });
    expect(ks3Filter).toHaveAttribute("checked");
  });
  test("respect 'checked' attribute when filter not active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />
    );
    const ks3Filter = getByRole("checkbox", {
      name: "Toggle Key-stage 3 filter",
    });
    expect(ks3Filter).not.toHaveAttribute("checked");
  });
  test("onChange on click", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />
    );
    const ks3Filter = getByRole("checkbox", {
      name: "Toggle Key-stage 3 filter",
    });
    ks3Filter.click();
    expect(ks3OnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: ks3Filter })
    );
  });
});
