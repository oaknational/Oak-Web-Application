import SearchFilters from "./SearchFilters";
import { searchFilters, mockOnChange } from "./test-helpers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const props = searchFilters;

describe("SearchFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all the key stage, subject filters and search type filters", () => {
    const { getAllByRole } = renderWithTheme(
      <SearchFilters
        legacyFilter={props.legacyFilter}
        contentTypeFilters={props.contentTypeFilters}
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
        examBoardFilters={props.examBoardFilters}
      />,
    );
    const searchFilters = getAllByRole("checkbox");
    //+1 for the 'show new only' filter
    expect(searchFilters).toHaveLength(
      props.keyStageFilters.length +
        props.subjectFilters.length +
        props.examBoardFilters.length +
        1,
    );
  });
  test("have correct a11y label", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        legacyFilter={props.legacyFilter}
        contentTypeFilters={props.contentTypeFilters}
        subjectFilters={props.subjectFilters}
        keyStageFilters={props.keyStageFilters}
        examBoardFilters={props.examBoardFilters}
      />,
    );
    const showNewContentFilter = getByRole("checkbox", {
      name: "Show new content filter",
    });
    const ks2Filter = getByRole("checkbox", {
      name: "Key stage 2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const ocrFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    expect(showNewContentFilter).toBeInTheDocument();
    expect(mathsFilter).toBeInTheDocument();
    expect(ks2Filter).toBeInTheDocument();
    expect(ocrFilter).toBeInTheDocument();
  });
  test("respect 'checked' attribute when filter active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        legacyFilter={{ ...props.legacyFilter, checked: true }}
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
    const newContentFilter = getByRole("checkbox", {
      name: "Show new content filter",
    });
    const ks2Filter = getByRole("checkbox", {
      name: "Key stage 2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const examBoardFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    expect(newContentFilter).toHaveAttribute("checked");
    expect(ks2Filter).toHaveAttribute("checked");
    expect(mathsFilter).toHaveAttribute("checked");
    expect(examBoardFilter).toHaveAttribute("checked");
  });
  test("respect 'checked' attribute when filter not active", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        legacyFilter={props.legacyFilter}
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
    const newContentFilter = getByRole("checkbox", {
      name: "Show new content filter",
    });
    const ks2Filter = getByRole("checkbox", {
      name: "Key stage 2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const examBoardFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    expect(newContentFilter).not.toHaveAttribute("checked");

    expect(ks2Filter).not.toHaveAttribute("checked");
    expect(mathsFilter).not.toHaveAttribute("checked");
    expect(examBoardFilter).not.toHaveAttribute("checked");
  });
  test("onChange on click", () => {
    const { getByRole } = renderWithTheme(
      <SearchFilters
        legacyFilter={props.legacyFilter}
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
    const newContentFilter = getByRole("checkbox", {
      name: "Show new content filter",
    });
    const ks2Filter = getByRole("checkbox", {
      name: "Key stage 2 filter",
    });
    const mathsFilter = getByRole("checkbox", {
      name: "Maths filter",
    });
    const examBoardFilter = getByRole("checkbox", {
      name: "OCR filter",
    });
    newContentFilter.click();
    examBoardFilter.click();

    ks2Filter.click();
    mathsFilter.click();

    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });
});
