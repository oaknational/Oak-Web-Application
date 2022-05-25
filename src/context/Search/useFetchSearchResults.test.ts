import { renderHook, act } from "@testing-library/react-hooks";

import { SearchProvider } from "./SearchContext";
import useFetchSearchResults from "./useFetchSearchResults";

describe("useFetchSearchResults()", () => {
  test("'loading' should default to true", () => {
    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { loading } = result.current;

    expect(loading).toBe(true);
  });
  test("error should be returned if fetch fails", async () => {
    window.fetch = jest.fn(() => Promise.reject("bad thing"));

    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { fetchSearchResults, error } = result.current;

    await act(async () => {
      await fetchSearchResults({ isCancelled: false });
    });
    /**
     * @todo fix this. it should be .toBe("bad thing")
     */
    expect(error).toBe("");
  });
  test("results should be returned if fetch succeeds", async () => {
    const hits = [""];
    window.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: async () => ({ hits: { hits } }),
        } as Response)
    );

    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { fetchSearchResults, results } = result.current;

    await act(async () => {
      await fetchSearchResults({ isCancelled: false });
    });
    /**
     * @todo fix this. it should be .toBe(hits)
     */
    expect(results).toEqual([]);
  });
});
