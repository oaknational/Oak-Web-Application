import { renderHook, act } from "@testing-library/react";

import useSearchFilters, { UseSearchFiltersProps } from "./useSearchFilters";

const setQuery = jest.fn();

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
    jest.clearAllMocks();
  });
  test("'checked' should be false if key stage filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const checked =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.checked;

    expect(checked).toBe(false);
  });
  test("'checked' should be true if key stage filter active", () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const checked =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.checked;

    expect(checked).toBe(true);
  });
  test("'checked' should be false if unit and lesson filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const lessonChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    const unitChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    expect(lessonChecked).toBe(false);
    expect(unitChecked).toBe(false);
  });
  test("'checked' should be true if key stage filter active", () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, contentTypes: ["unit", "lesson"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );

    const lessonChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.checked;
    const unitChecked =
      useSearchFiltersHook.result.current.contentTypeFilters[1]?.checked;

    expect(lessonChecked).toBe(true);
    expect(unitChecked).toBe(true);
  });

  test("onChange should remove lesson from query if active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, contentTypes: ["unit", "lesson"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const lessonOnChange =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.onChange;

    act(() => {
      lessonOnChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ contentTypes: ["unit"] });
  });

  test("onChange should add lesson from query if not active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, contentTypes: ["unit"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const lessonOnChange =
      useSearchFiltersHook.result.current.contentTypeFilters[0]?.onChange;

    act(() => {
      lessonOnChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ contentTypes: ["unit", "lesson"] });
  });

  test("onChange should remove key stage from query if active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, keyStages: ["ks1", "ks3"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const onChange =
      useSearchFiltersHook.result.current.keyStageFilters[0]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ keyStages: ["ks3"] });
  });
  test("onChange should add key stage to query if not active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const onChange =
      useSearchFiltersHook.result.current.keyStageFilters[3]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ keyStages: ["ks1", "ks4"] });
  });
  test("'checked' should be false if subject filter not active", () => {
    const useSearchFiltersHook = renderHook(() => useSearchFilters(props));
    const checked =
      useSearchFiltersHook.result.current.subjectFilters[0]?.checked;

    expect(checked).toBe(false);
  });

  test("'checked' should be true if subject filter active", () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, subjects: ["computing"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const checked =
      useSearchFiltersHook.result.current.subjectFilters[0]?.checked;

    expect(checked).toBe(true);
  });

  test("onChange should remove subject from query if active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, subjects: ["computing", "english"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
    );
    const onChange =
      useSearchFiltersHook.result.current.subjectFilters[0]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ subjects: ["english"] });
  });

  test("onChange should add subject to query if not active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, subjects: ["computing"] },
    };
    const useSearchFiltersHook = renderHook(() =>
      useSearchFilters(withFilterActive)
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
