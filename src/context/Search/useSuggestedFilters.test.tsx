import { renderHook } from "@testing-library/react";

import { useSuggestedFilters } from "./useSuggestedFilters";
import { SuggestedFilters } from "./search.types";

const mockUseSWR = jest.fn<
  { data: unknown; error: unknown; isLoading: boolean },
  []
>(() => ({
  data: null,
  error: null,
  isLoading: false,
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

const reportError = jest.fn();

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const validSearchIntentPayload = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: null,
    year: null,
    examBoard: null,
  },
  suggestedFilters: [
    { type: "subject", slug: "maths", title: "Maths" },
    { type: "key-stage", slug: "ks1", title: "Ks1" },
    { type: "key-stage", slug: "ks2", title: "Ks2" },
    { type: "key-stage", slug: "ks3", title: "Ks3" },
    { type: "key-stage", slug: "ks4", title: "Ks4" },
    { type: "exam-board", slug: "aqa", title: "Aqa" },
    { type: "exam-board", slug: "edexcel", title: "Edexcel" },
  ],
};

const validSearchFilters: SuggestedFilters = {
  searchFilters: [
    { type: "subject", slug: "maths", value: "Maths", source: "fuzzy_match" },
    { type: "key-stage", slug: "ks1", value: "Ks1", source: "ai" },
    { type: "key-stage", slug: "ks2", value: "Ks2", source: "ai" },
    { type: "key-stage", slug: "ks3", value: "Ks3", source: "ai" },
    { type: "key-stage", slug: "ks4", value: "Ks4", source: "ai" },
    { type: "exam-board", slug: "aqa", value: "Aqa", source: "ai" },
    { type: "exam-board", slug: "edexcel", value: "Edexcel", source: "ai" },
  ],
  status: "success",
  error: undefined,
};

describe("useSuggestedFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns undefined and status 'idle' if is not enabled", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: null,
      error: null,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: false }),
    );

    expect(result.current).toEqual({
      searchFilters: undefined,
      status: "idle",
    });

    // SWR should be called with null key when disabled
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object),
    );
  });

  it("returns undefined and status 'idle' if term length is < 2", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: null,
      error: null,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "m", enabled: true }),
    );

    expect(result.current).toEqual({
      searchFilters: undefined,
      status: "idle",
    });

    // SWR should be called with null key when term is too short
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object),
    );
  });

  it("returns status 'loading' when SWR is loading", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: null,
      error: null,
      isLoading: true,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: true }),
    );

    expect(result.current).toEqual({
      searchFilters: undefined,
      status: "loading",
    });

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/search/intent?v=1&searchTerm=maths",
      expect.any(Function),
      expect.any(Object),
    );
  });

  it("returns search filters and status 'success' when SWR has data", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: validSearchIntentPayload,
      error: null,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "science", enabled: true }),
    );

    expect(result.current).toEqual(validSearchFilters);
    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/search/intent?v=1&searchTerm=science",
      expect.any(Function),
      expect.any(Object),
    );
  });

  it("returns empty search filters and status 'error' when SWR has error", () => {
    const mockError = new Error("Fetch failed");
    mockUseSWR.mockImplementationOnce(() => ({
      data: null,
      error: mockError,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: true }),
    );

    expect(reportError).toHaveBeenCalledWith(mockError);

    expect(result.current).toEqual({
      searchFilters: [],
      status: "error",
      error: "Error: Fetch failed",
    });

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/search/intent?v=1&searchTerm=maths",
      expect.any(Function),
      expect.any(Object),
    );
  });
  it("removes any whitespace from the term before sending to the API", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: validSearchIntentPayload,
      error: null,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "  maths fractions  ", enabled: true }),
    );

    expect(result.current).toEqual(validSearchFilters);
    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/search/intent?v=1&searchTerm=maths+fractions",
      expect.any(Function),
      expect.any(Object),
    );
  });
  it("removes any special characters from the term before sending to the API", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: validSearchIntentPayload,
      error: null,
      isLoading: false,
    }));

    const { result } = renderHook(() =>
      useSuggestedFilters({
        term: "  maths  fractions f&foo=bar   ",
        enabled: true,
      }),
    );

    expect(result.current).toEqual(validSearchFilters);
    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/search/intent?v=1&searchTerm=maths+fractions+f%26foo%3Dbar",
      expect.any(Function),
      expect.any(Object),
    );
  });
});
