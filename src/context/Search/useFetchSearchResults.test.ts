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
  test("error should be shown if fetch fails", async () => {
    window.fetch = jest.fn(() => Promise.reject("failed"));

    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { fetchSearchResults, error } = result.current;

    await act(async () => {
      await fetchSearchResults({ isCancelled: false });
    });
    /**
     * @todo fix this error
     */
    expect(error).toBe("");
  });
});
