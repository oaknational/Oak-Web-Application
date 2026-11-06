import { getSearchFilters } from "./getSearchFilters";
import { GetSearchFiltersProps } from "./search.types";

const props: GetSearchFiltersProps = {
  allKeyStages: [
    { shortCode: "KS1", slug: "ks1", title: "Key-stage 1" },
    { shortCode: "KS2", slug: "ks2", title: "Key-stage 2" },
    { shortCode: "KS3", slug: "ks3", title: "Key-stage 3" },
    { shortCode: "KS4", slug: "ks4", title: "Key-stage 4" },
  ],
  allYearGroups: [
    {
      slug: "year-1",
      title: "Year 1",
    },
    { slug: "year-10", title: "Year 10" },
  ],
  allSubjects: [
    { slug: "computing", title: "Computing" },
    { slug: "english", title: "English" },
    { slug: "maths", title: "Maths" },
    { slug: "science", title: "science" },
  ],
  allContentTypes: [
    { slug: "lesson", title: "Lessons" },
    { slug: "unit", title: "Units" },
  ],
  allExamBoards: [
    { slug: "aqa", title: "AQA" },
    { slug: "edexcel", title: "Edexcel" },
    { slug: "eduqas", title: "Eduqas" },
    { slug: "ocr", title: "OCR" },
  ],
  query: {
    term: "macbethy",
    keyStages: [],
    subjects: [],
    contentTypes: [],
  },
};

describe("getSearchFilters()", () => {
  test("'checked' should be false if key stage filter not active", () => {
    const filters = getSearchFilters(props);
    const checked = filters.keyStageFilters[0]?.checked;

    expect(checked).toBe(false);
  });

  test("'checked' should be true if key stage filter active", () => {
    const withFilterActive: GetSearchFiltersProps = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const filters = getSearchFilters(withFilterActive);
    const checked = filters.keyStageFilters[0]?.checked;

    expect(checked).toBe(true);
  });

  test("'checked' should be false if unit and lesson filter not active", () => {
    const filters = getSearchFilters(props);
    const lessonChecked = filters.contentTypeFilters[0]?.checked;
    const unitChecked = filters.contentTypeFilters[1]?.checked;

    expect(lessonChecked).toBe(false);
    expect(unitChecked).toBe(false);
  });

  test("'checked' should be true if unit/lesson filter active", () => {
    const withFilterActive: GetSearchFiltersProps = {
      ...props,
      query: { ...props.query, contentTypes: ["unit", "lesson"] },
    };
    const filters = getSearchFilters(withFilterActive);

    const lessonChecked = filters.contentTypeFilters[0]?.checked;
    const unitChecked = filters.contentTypeFilters[1]?.checked;

    expect(lessonChecked).toBe(true);
    expect(unitChecked).toBe(true);
  });

  test("'checked' should be false if subject filter not active", () => {
    const filters = getSearchFilters(props);
    const checked = filters.subjectFilters[0]?.checked;

    expect(checked).toBe(false);
  });

  test("'checked' should be true if subject filter active", () => {
    const withFilterActive: GetSearchFiltersProps = {
      ...props,
      query: { ...props.query, subjects: ["computing"] },
    };
    const filters = getSearchFilters(withFilterActive);
    const checked = filters.subjectFilters[0]?.checked;

    expect(checked).toBe(true);
  });

  test("year group filter should reflect active selections", () => {
    const withYearGroupActive: GetSearchFiltersProps = {
      ...props,
      query: { ...props.query, yearGroups: ["year-1"] },
    };
    const filters = getSearchFilters(withYearGroupActive);

    expect(filters.yearGroupFilters[0]?.checked).toBe(true);
    expect(filters.yearGroupFilters[1]?.checked).toBe(false);
  });

  test("exam board filter should reflect active selections", () => {
    const withExamBoardActive: GetSearchFiltersProps = {
      ...props,
      query: { ...props.query, examBoards: ["aqa", "edexcel"] },
    };
    const filters = getSearchFilters(withExamBoardActive);

    expect(filters.examBoardFilters[0]?.checked).toBe(true);
    expect(filters.examBoardFilters[1]?.checked).toBe(true);
    expect(filters.examBoardFilters[2]?.checked).toBe(false);
  });
});
