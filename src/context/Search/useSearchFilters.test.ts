import { renderHook, act } from "@testing-library/react";

import useSearchFilters from "./useSearchFilters";
import { UseSearchFiltersProps } from "./search.types";

const setQuery = vi.fn();

const props: UseSearchFiltersProps = {
  allKeyStages: [
    { shortCode: "KS1", slug: "ks1", title: "Key-stage 1" },
    { shortCode: "KS2", slug: "ks2", title: "Key-stage 2" },
    { shortCode: "KS3", slug: "ks3", title: "Key-stage 3" },
    { shortCode: "KS4", slug: "ks4", title: "Key-stage 4" },
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
  setQuery,
  query: {
    term: "macbethy",
    keyStages: [],
    subjects: [],
    contentTypes: [],
  },
};

describe("useSearchFilters()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("'checked' should be false if key stage filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const checked =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.checked;

    expect(checked).toBe(false);
  });
  it("'checked' should be true if key stage filter active", () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const checked =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.checked;

    expect(checked).toBe(true);
  });
  it("'checked' should be false if unit and lesson filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const lessonChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    const unitChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    expect(lessonChecked).toBe(false);
    expect(unitChecked).toBe(false);
  });
  it("'checked' should be true if key stage filter active", () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, contentTypes: ["unit", "lesson"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );

    const lessonChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    const unitChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[1]?.checked;

    expect(lessonChecked).toBe(true);
    expect(unitChecked).toBe(true);
  });

  it("onChange should remove lesson from query if active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, contentTypes: ["unit", "lesson"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const lessonOnChange =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.onChange;

    act(() => {
      lessonOnChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ contentTypes: ["unit"] });
  });

  it("onChange should add lesson from query if not active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, contentTypes: ["unit"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const lessonOnChange =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.onChange;

    act(() => {
      lessonOnChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ contentTypes: ["unit", "lesson"] });
  });

  it("onChange should remove key stage from query if active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, keyStages: ["ks1", "ks3"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const onChange =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ keyStages: ["ks3"] });
  });
  it("onChange should add key stage to query if not active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const onChange =
      useSearchFiltersHook.result.current.keyStageFilters[3]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ keyStages: ["ks1", "ks4"] });
  });
  it("'checked' should be false if subject filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const checked =
      useSearchFiltersHook.result.current.subjectFilters[0]?.checked;

    expect(checked).toBe(false);
  });

  it("'checked' should be true if subject filter active", () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, subjects: ["computing"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const checked =
      useSearchFiltersHook.result.current.subjectFilters[0]?.checked;

    expect(checked).toBe(true);
  });

  it("onChange should remove subject from query if active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, subjects: ["computing", "english"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const onChange =
      useSearchFiltersHook.result.current.subjectFilters[0]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ subjects: ["english"] });
  });

  it("onChange should add subject to query if not active", async () => {
    const withFilterActive: UseSearchFiltersProps = {
      ...props,
      query: { ...props.query, subjects: ["computing"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive),
    );
    const onChange =
      useSearchFiltersHook.result.current.subjectFilters[3]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ subjects: ["computing", "science"] });
  });
});
