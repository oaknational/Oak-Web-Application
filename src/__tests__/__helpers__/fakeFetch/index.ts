import type { FakeResponse, FetchMatcher } from "./generics";

type FakeFetch = jest.Mock<Promise<FakeResponse>>;

/**
 * Takes an array of FetchMatchers, or a single FetchMatcher, and returns a
 * mock fetch function that will return the response specified by the matcher.
 *
 * @param matchers - An array of FetchMatchers, or a single FetchMatcher.
 * @returns An object with two references to the same mock fetch function, one typed as fetch, and one typed as a mock.
 */
export function getFakeFetch(matchers: FetchMatcher[] | FetchMatcher): {
  asFetch: typeof fetch;
  asMock: FakeFetch;
} {
  const fakeFetch: FakeFetch = jest.fn();

  fakeFetch.mockImplementation((...fetchArgs) => {
    const requestedPath = fetchArgs[0];

    let matcher: FetchMatcher | undefined;
    if (Array.isArray(matchers)) {
      matcher = matchers.find((matcher) => matcher.path === requestedPath);
    } else {
      matcher = matchers;
    }

    if (!matcher) {
      throw new Error(
        `No mocked response specified for path '${requestedPath}'.`,
      );
    }

    return matcher.response;
  });

  return {
    asFetch: fakeFetch as unknown as typeof fetch,
    asMock: fakeFetch,
  };
}

/**
 * Export the specific fetch matcher builders.
 */

export { buildHubspotFetchMatcher } from "./hubspot";
