import { renderHook, waitFor } from "@testing-library/react";

import { SuggestedFilters, useSuggestedFilters } from "./useSuggestedFilters";

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
    { type: "subject", slug: "maths", value: "Maths" },
    { type: "key-stage", slug: "ks1", value: "Ks1" },
    { type: "key-stage", slug: "ks2", value: "Ks2" },
    { type: "key-stage", slug: "ks3", value: "Ks3" },
    { type: "key-stage", slug: "ks4", value: "Ks4" },
    { type: "exam-board", slug: "aqa", value: "Aqa" },
    { type: "exam-board", slug: "edexcel", value: "Edexcel" },
  ],
  status: "success",
  error: undefined,
};

describe("useSuggestedFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => validSearchIntentPayload,
    });
  });
  it("returns undefined and status 'idle' if is not enabled", () => {
    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: false }),
    );
    expect(result.current).toEqual({
      searchFilters: undefined,
      status: "idle",
    });
  });
  it("returns undefined and status 'idle' if term length is < 2", () => {
    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "m", enabled: true }),
    );
    expect(result.current).toEqual({
      searchFilters: undefined,
      status: "idle",
    });
  });
  it("returns status loading and status 'idle' if term length is < 2", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => deferred.promise,
    });
    function createDeferred() {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    }
    const deferred = createDeferred();
    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: true }),
    );
    await waitFor(() => expect(result.current.status).toBe("loading"));
    if (!deferred.resolve) throw new Error("deferred.resolve is undefined");
  });
  it("returns search filters and status 'success' when fetch resolves", async () => {
    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: true }),
    );
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current).toEqual(validSearchFilters);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/intent?query=maths",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
  });
  it("returns empty search filters and status 'error' when fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch failed"));
    const { result } = renderHook(() =>
      useSuggestedFilters({ term: "maths", enabled: true }),
    );
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current).toEqual({
      searchFilters: [],
      status: "error",
      error: "Error: Fetch failed",
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/intent?query=maths",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
  });
});
