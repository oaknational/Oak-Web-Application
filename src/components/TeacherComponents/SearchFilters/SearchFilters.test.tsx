import SearchFilters from "./SearchFilters";
import { searchFilters, mockOnChange } from "./test-helpers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

vi.mock("next/dist/client/router", () => require("next-router-mock"));

const props = searchFilters;

const searchRefined = vi.fn();

describe("SearchFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders all the key stage, subject filters and search type filters", () => {
    const { getAllByRole } = renderWithTheme(
      <SearchFilters
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters}
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
        examBoardFilters={props.examBoardFilters}
      />,
    );
    const searchFilters = getAllByRole("checkbox");
    expect(searchFilters).toHaveLength(
      props.keyStageFilters.length +
        props.subjectFilters.length +
        props.contentTypeFilters.length +
        props.examBoardFilters.length,
    );
  });
  test("have correct a11y label", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters}
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
        examBoardFilters={props.examBoardFilters}
      />,
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
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        examBoardFilters={props.examBoardFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
      />,
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const lessonFilter = getByRole("checkbox", {
      name: "Lessons filter",
    });
    const examBoardFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    expect(ks2Filter).toHaveAttribute("checked");
    expect(mathsFilter).toHaveAttribute("checked");
    expect(lessonFilter).toHaveAttribute("checked");
    expect(examBoardFilter).toHaveAttribute("checked");
  });
  test("respect 'checked' attribute when filter not active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        examBoardFilters={props.examBoardFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />,
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const unitFilter = getByRole("checkbox", {
      name: "Units filter",
    });
    const examBoardFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    expect(ks2Filter).not.toHaveAttribute("checked");
    expect(mathsFilter).not.toHaveAttribute("checked");
    expect(unitFilter).not.toHaveAttribute("checked");
    expect(examBoardFilter).not.toHaveAttribute("checked");
  });
  test("onChange on click", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        examBoardFilters={props.examBoardFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />,
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const unitFilter = getByRole("checkbox", {
      name: "Units filter",
    });
    ks2Filter.click();
    mathsFilter.click();
    unitFilter.click();

    expect(mockOnChange).toHaveBeenCalledTimes(3);

    // expect(mockOnChange).toHaveBeenCalledWith(
    //   expect.objectContaining({ target: ks2Filter }),
    // );
    // expect(mockOnChange).toHaveBeenCalledWith(
    //   expect.objectContaining({ target: mathsFilter }),
    // );
    // expect(mockOnChange).toHaveBeenCalledWith(
    //   expect.objectContaining({ target: unitFilter }),
    // );
  });

  test("searchRefined function invoked when checked", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        searchRefined={searchRefined}
        contentTypeFilters={props.contentTypeFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        keyStageFilters={props.keyStageFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
        subjectFilters={props.subjectFilters.map((filter) => ({
          ...filter,
          checked: true,
        }))}
        examBoardFilters={props.examBoardFilters.map((filter) => ({
          ...filter,
          checked: false,
        }))}
      />,
    );
    const ks2Filter = getByRole("checkbox", {
      name: "KS2 filter",
    });
    ks2Filter.click();

    expect(searchRefined).toHaveBeenCalledTimes(1);
  });
});
