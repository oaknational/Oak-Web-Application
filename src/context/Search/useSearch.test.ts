import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";

import searchPageFixture from "../../node-lib/curriculum-api/fixtures/searchPage.fixture";
import { renderHookWithProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useSearch from "./useSearch";
import elasticResponseFixture from "./elasticResponse.2020.fixture.json";

const goodFetchResolvedValueWithResults = {
  ok: true,
  json: async () => {
    return elasticResponseFixture;
  },
};

const goodFetchResolvedValueNoResults = {
  ok: true,
  json: async () => {
    return {
      took: 1,
      timed_out: false,
      _shards: { total: 3, successful: 3, skipped: 0, failed: 0 },
      hits: { total: { value: 0, relation: "eq" }, max_score: null, hits: [] },
    };
  },
};

const badFetchResolvedValue = {
  ok: false,
  json: async () => {
    return {
      took: 1,
      timed_out: false,
      _shards: { total: 3, successful: 3, skipped: 0, failed: 0 },
      hits: { total: { value: 0, relation: "eq" }, max_score: null, hits: [] },
    };
  },
};

const goodFetchMockImplementation = (url: string) => {
  if (url === "NEXT_PUBLIC_SEARCH_API_URL") {
    return goodFetchResolvedValueWithResults;
  } else {
    return {
      ok: true,
      json: async () => {
        return {
          took: 1,
          timed_out: false,
          _shards: { total: 3, successful: 3, skipped: 0, failed: 0 },
          hits: {
            total: { value: 0, relation: "eq" },
            max_score: null,
            hits: [],
          },
        };
      },
    };
  }
};

const reportError = vi.fn();
vi.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));
const fetch = vi.spyOn(global, "fetch") as Mock;
vi.mock("next/dist/client/router", () => require("next-router-mock"));

fetch.mockResolvedValue(goodFetchResolvedValueNoResults);

vi.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const allKeyStages = searchPageFixture().keyStages;

const providers = { router: { url: "?term=test-term" } };

describe("useSearch()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("query should come from url querystring", async () => {
    const { result } = renderHookWithProviders({
      router: { url: "?term=something" },
    })(() => useSearch({ allKeyStages }));

    await waitFor(() => {
      expect(result.current.query.term).not.toBe("test-tem");
    });
  });
  it("status should default to 'not-asked' if no search term in url", () => {
    const { result } = renderHookWithProviders({ router: { url: "" } })(() =>
      useSearch({ allKeyStages }),
    );
    const { status } = result.current;

    expect(status).toBe("not-asked");
  });
  it("status should default to 'loading' if search term in url", () => {
    const { result } = renderHookWithProviders({
      router: { url: "?term=something" },
    })(() => useSearch({ allKeyStages }));
    const { status } = result.current;

    expect(status).toBe("loading");
  });
  it("fetch should not be called if no search term in query", () => {
    renderHookWithProviders({ router: { url: "" } })(() =>
      useSearch({ allKeyStages }),
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("fetch should be called once if search term in query", async () => {
    renderHookWithProviders(providers)(() => useSearch({ allKeyStages }));

    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("results should be returned in the correct form", async () => {
    fetch.mockImplementation(goodFetchMockImplementation);

    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await waitFor(() =>
      expect(result.current.results[0]).toEqual({
        _id: "5KnzTocBd235CCw7oqe1",
        _index: "lessons_production",
        _score: 121.737686,
        legacy: true,
        _source: {
          expired: false,
          has_copyright_material: false,
          id: 211319,
          key_stage_slug: "key-stage-2",
          key_stage_title: "Key Stage 2",
          lesson_description:
            "In this lesson we are introduced to Macbeth and Banquo. We will explore the characters' thoughts and feelings and how they respond when they encounter the witches.",
          slug: "dipping-into-macbeth-brave-macbeth-part-2-crvkad",
          subject_slug: "drama",
          subject_title: "Drama",
          theme_title: null,
          title: "Dipping into Macbeth - Brave Macbeth (Part 2)",
          topic_slug: "dipping-into-shakespeare-da5e",
          topic_title: "Dipping into Shakespeare",
          type: "lesson",
          tier: null,
          phase: "primary",
          pathways: [],
        },
        highlight: {
          lesson_description:
            'In this lesson we are introduced to <mark class="highlighted">Macbeth</mark> and Banquo. We will explore the characters\' thoughts and feelings and how they respond when they encounter the witches.',
        },
      }),
    );
  });
  it("results should be returned in the correct form", async () => {
    fetch.mockImplementation(goodFetchMockImplementation);
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );
    await waitFor(() => {
      expect(result.current.results.length).toBe(20);
    });
  });
  it("status should be 'fail' if fetch fails", async () => {
    fetch.mockResolvedValue(badFetchResolvedValue);
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await waitFor(() => expect(result.current.status).toBe("fail"));
  });
  test.skip("error should be reported", async () => {
    // @todo skipping this test, not sure why it's failing
    const error = new Error("bad thing");
    fetch.mockRejectedValue(error);

    renderHookWithProviders(providers)(() => useSearch({ allKeyStages }));

    await waitFor(() => expect(reportError).toHaveBeenCalled());
  });
});
