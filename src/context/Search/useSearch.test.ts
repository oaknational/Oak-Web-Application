import { act, waitFor } from "@testing-library/react";

import searchPageFixture from "../../node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import { renderHookWithProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useSearch from "./useSearch";
import elasticResponseFixture from "./search-api/2023/elasticResponse.2023.fixture.json";

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

const goodFetchMockImplementation = () => {
  return goodFetchResolvedValueWithResults;
};

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter/errorReporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));
const fetch = jest.spyOn(global, "fetch") as jest.Mock;
jest.mock("next/dist/client/router", () => require("next-router-mock"));

fetch.mockResolvedValue(goodFetchResolvedValueNoResults);

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const allKeyStages = searchPageFixture().keyStages;

const providers = { router: { url: "?term=test-term" } };

describe("useSearch()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("query should come from url querystring", async () => {
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await waitFor(() => {
      expect(result.current.query.term).not.toBe("test-tem");
    });
  });
  test("status should default to 'not-asked' if no search term in url", () => {
    const { result } = renderHookWithProviders({ router: { url: "" } })(() =>
      useSearch({ allKeyStages }),
    );
    const { status } = result.current;

    expect(status).toBe("not-asked");
  });
  test("status should default to 'loading' if search term in url", async () => {
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await act(async () => {
      const { status } = result.current;

      expect(status).toBe("loading");
    });
  });
  test("fetch should not be called if no search term in query", () => {
    renderHookWithProviders({ router: { url: "" } })(() =>
      useSearch({ allKeyStages }),
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  test("fetch should be called once if search term in query", async () => {
    await act(async () =>
      renderHookWithProviders(providers)(() => useSearch({ allKeyStages })),
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });
  test("results should be returned in the correct form", async () => {
    fetch.mockImplementation(goodFetchMockImplementation);

    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await waitFor(() =>
      expect(result.current.results[0]).toEqual({
        _index: "lessons_1712737230873",
        _id: "Z38Yx44Bc8iIk5N9Klp6",
        _score: 104.29718,
        highlight: {
          pupil_lesson_outcome:
            "I can describe the relationship between <b>Macbeth</b> and Lady <b>Macbeth</b>.",
        },
        _source: {
          slug: "the-relationship-between-macbeth-and-lady-macbeth",
          title: "The relationship between Macbeth and Lady Macbeth",
          pupil_lesson_outcome:
            "I can describe the relationship between Macbeth and Lady Macbeth.",
          programme_slug: "english-secondary-ks4-eduqas",
          unit_slug: "macbeth-lady-macbeth-as-a-machiavellian-villain",
          unit_title: "Macbeth: Lady Macbeth as a machiavellian villain",
          key_stage_slug: "ks4",
          key_stage_title: "Key Stage 4",
          year_slug: "year-10",
          year_title: "Year 10",
          subject_slug: "english",
          subject_title: "English",
          cohort: "2023-2024",
          type: "lesson",
          pathways: [],
        },
      }),
    );
  });
  test("results should be returned in the correct form", async () => {
    fetch.mockImplementation(goodFetchMockImplementation);
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );
    await waitFor(() => {
      expect(result.current.results.length).toBe(4);
    });
  });
  test("status should be 'fail' if fetch fails", async () => {
    fetch.mockResolvedValue(badFetchResolvedValue);
    const { result } = renderHookWithProviders(providers)(() =>
      useSearch({ allKeyStages }),
    );

    await waitFor(() => expect(result.current.status).toBe("fail"));
  });
  test("error should be reported", async () => {
    // @todo skipping this test, not sure why it's failing
    const error = new Error("bad thing");
    fetch.mockRejectedValue(error);

    renderHookWithProviders(providers)(() => useSearch({ allKeyStages }));

    await waitFor(() => expect(reportError).toHaveBeenCalled());
  });
});
