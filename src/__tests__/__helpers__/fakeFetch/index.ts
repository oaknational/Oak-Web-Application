import type { FakeResponse, FetchMatcher } from "./generics";

type FakeFetch = jest.Mock<Promise<FakeResponse>>;

/**
 * Takes an array of FetchMatchers, or a single FetchMatcher, and returns a
 * mock fetch function that will return the response specified by the matcher.
 *
 * @param matchers - An array of FetchMatchers, or a single FetchMatcher.
 * @returns A fake fetch function. We use type coercion because we need it to be assignable to the global fetch function.
 */
export function getFakeFetch(
  matchers: FetchMatcher[] | FetchMatcher,
): typeof fetch {
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

  return fakeFetch as unknown as typeof fetch;
}

/**
 * Export the specific fetch matcher builders.
 */

export { buildHubspotFetchMatcher } from "./hubspot";
