import { act, waitFor } from "@testing-library/react";
import { useRouter } from "next/compat/router";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import searchPageFixture from "../../node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import { renderHookWithProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useSearch from "./useSearch";
import elasticResponseFixture from "./search-api/2023/elasticResponse.2023.fixture.json";

jest.mock("next/compat/router", () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = jest.mocked(useRouter);
const mockUseSearchParams = jest.mocked(useSearchParams);

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
const fetch = jest.spyOn(globalThis, "fetch") as jest.Mock;

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const allKeyStages = searchPageFixture().keyStages;

const setNavigation = (url = "?term=test-term") => {
  const queryString = url.startsWith("?") ? url : `?${url}`;
  const queryWithoutPrefix = queryString.replace(/^\?/, "");

  mockUseRouter.mockReturnValue({
    asPath: `/teachers/search${queryString}`,
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    isReady: true,
    pathname: "/teachers/search",
    query: {},
    route: "/teachers/search",
    basePath: "",
    isFallback: false,
    isLocaleDomain: false,
    isPreview: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    beforePopState: jest.fn(),
    reload: jest.fn(),
    forward: jest.fn(),
  });

  mockUseSearchParams.mockReturnValue(
    new URLSearchParams(
      queryWithoutPrefix,
    ) as unknown as ReadonlyURLSearchParams,
  );
};

const renderUseSearch = (url = "?term=test-term") => {
  setNavigation(url);
  return renderHookWithProviders()(() => useSearch({ allKeyStages }));
};

describe("useSearch()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue(goodFetchResolvedValueNoResults);
  });
  test("query should come from url querystring", async () => {
    const { result } = renderUseSearch("?term=test-term");

    await waitFor(() => {
      expect(result.current.query.term).not.toBe("test-tem");
    });
  });
  test("status should default to 'not-asked' if no search term in url", () => {
    const { result } = renderUseSearch("");
    const { status } = result.current;

    expect(status).toBe("not-asked");
  });
  test("status should default to 'loading' if search term in url", async () => {
    const { result } = renderUseSearch("?term=test-term");

    await waitFor(() => {
      expect(result.current.status).toBe("loading");
    });
  });
  test("fetch should not be called if no search term in query", () => {
    renderUseSearch("");
    expect(fetch).not.toHaveBeenCalled();
  });
  test("fetch should be called once if search term in query", async () => {
    await act(async () => renderUseSearch("?term=test-term"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
  test("results should be returned in the correct form", async () => {
    fetch.mockImplementation(goodFetchMockImplementation);

    const { result } = renderUseSearch("?term=test-term");

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
    const { result } = renderUseSearch("?term=test-term");
    await waitFor(() => {
      expect(result.current.results.length).toBe(4);
    });
  });
  test("status should be 'fail' if fetch fails", async () => {
    fetch.mockResolvedValue(badFetchResolvedValue);
    const { result } = renderUseSearch("?term=test-term");

    await waitFor(() => expect(result.current.status).toBe("fail"));
  });
  test("error should be reported", async () => {
    const error = new Error("bad thing");
    fetch.mockRejectedValue(error);

    renderUseSearch("?term=test-term");

    await waitFor(() => expect(reportError).toHaveBeenCalled());
  });
});
