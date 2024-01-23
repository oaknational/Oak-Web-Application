import type { FakeResponse, FetchMatcher } from "./generics";

/**
 * Takes an array of FetchMatchers, or a single FetchMatcher, and returns a
 * mock fetch function that will return the response specified by the matcher.
 *
 * @param matchers - An array of FetchMatchers, or a single FetchMatcher.
 * @returns A mock fetch function.
 */
export function getFakeFetch(
  matchers: FetchMatcher[] | FetchMatcher,
): jest.Mock<() => Promise<FakeResponse>> {
  const mockFetch = jest.fn();

  mockFetch.mockImplementation((...fetchArgs) => {
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

  return mockFetch;
}

/**
 * Export the specific fetch matcher builders.
 */

export { buildHubspotFetchMatcher } from "./hubspot";
