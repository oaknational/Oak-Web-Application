import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import { mockOnChange, searchFilters } from "./ActiveFilters.test";
import SearchFilters from "./SearchFilters";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const props = searchFilters;

describe("SearchFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders all the key stage and subject filters", () => {
    const { getAllByRole } = renderWithTheme(
      <SearchFilters
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
      />
    );
    const searchFilters = getAllByRole("checkbox");
    expect(searchFilters).toHaveLength(
      props.keyStageFilters.length + props.subjectFilters.length
    );
  });
  test("have correct a11y label", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
      />
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    expect(mathsFilter).toBeInTheDocument();
    expect(ks2Filter).toBeInTheDocument();
  });
  test("respect 'checked' attribute when filter active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
      />
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    expect(ks2Filter).toHaveAttribute("checked");
    expect(mathsFilter).toHaveAttribute("checked");
  });
  test("respect 'checked' attribute when filter not active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    expect(ks2Filter).not.toHaveAttribute("checked");
    expect(mathsFilter).not.toHaveAttribute("checked");
  });
  test("onChange on click", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
      />
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    ks2Filter.click();
    mathsFilter.click();
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: ks2Filter })
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: mathsFilter })
    );
  });
});
