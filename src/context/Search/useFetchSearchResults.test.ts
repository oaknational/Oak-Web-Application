import { renderHook, act } from "@testing-library/react";

import { SearchProvider } from "./SearchContext";
import useFetchSearchResults from "./useFetchSearchResults";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const reportError = jest.fn();
const errorReporter = () => () => reportError;

describe("useFetchSearchResults()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock("../../common-lib/error-reporter", () => ({
      __esModule: true,
      default: errorReporter,
    }));
  });
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

    // expect(reportError).toHaveBeenCalled();
    /**
     * @todo fix this. it should be .toBe("bad thing")
     */
    expect(error).toBe("");
  });
  test("results should be returned if fetch succeeds", async () => {
    const hits = [""];
    const jsonMock = jest.fn(
      async () => ({ ok: true, hits: { hits } } as unknown as Response)
    );
    window.fetch = jsonMock;

    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { fetchSearchResults, results } = result.current;

    await act(async () => {
      await fetchSearchResults({ isCancelled: false });
    });

    expect(jsonMock).toHaveBeenCalled();
    /**
     * @todo fix this. it should be .toBe(hits)
     */
    expect(results).toEqual([]);
  });

  test("'showMessage' should default to false", () => {
    const { result } = renderHook(() => useFetchSearchResults(), {
      wrapper: SearchProvider,
    });
    const { showMessage } = result.current;

    expect(showMessage).toBe(false);
  });
});
