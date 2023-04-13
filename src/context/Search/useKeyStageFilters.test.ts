import { renderHook, act } from "@testing-library/react";

import useKeyStageFilters, {
  UseKeyStageFiltersProps,
} from "./useKeyStageFilters";

const setQuery = jest.fn();

const props: UseKeyStageFiltersProps = {
  allKeyStages: [
    { shortCode: "KS1", slug: "ks1", title: "Key-stage 1" },
    { shortCode: "KS2", slug: "ks2", title: "Key-stage 2" },
    { shortCode: "KS3", slug: "ks3", title: "Key-stage 3" },
    { shortCode: "KS4", slug: "ks4", title: "Key-stage 4" },
  ],
  setQuery,
  query: { term: "macbethy", keyStages: [] },
};

describe("useKeyStageFilters()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("'checked' shuld be false if key stage filter not active", () => {
    const useKeyStageFiltersHook = renderHook(() => useKeyStageFilters(props));
    const checked = useKeyStageFiltersHook.result.current?.[0]?.checked;

    expect(checked).toBe(false);
  });
  test("'checked' should be true if key stage filter active", () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, keyStages: ["ks1"] },
    };
    const useKeyStageFiltersHook = renderHook(() =>
      useKeyStageFilters(withFilterActive)
    );
    const checked = useKeyStageFiltersHook.result.current?.[0]?.checked;

    expect(checked).toBe(true);
  });

  test("onChange should remove key stage from query if active", async () => {
    const withFilterActive = {
      ...props,
      query: { ...props.query, keyStages: ["ks1", "ks3"] },
    };
    const useKeyStageFiltersHook = renderHook(() =>
      useKeyStageFilters(withFilterActive)
    );
    const onChange = useKeyStageFiltersHook.result.current?.[0]?.onChange;

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
    const useKeyStageFiltersHook = renderHook(() =>
      useKeyStageFilters(withFilterActive)
    );
    const onChange = useKeyStageFiltersHook.result.current?.[3]?.onChange;

    act(() => {
      onChange?.();
    });

    const passedFunction = setQuery.mock.calls[0][0];

    expect(passedFunction({})).toEqual({ keyStages: ["ks1", "ks4"] });
  });
});
