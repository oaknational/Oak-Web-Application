import type { FakeResponse, FetchMatcher } from "./generics";

type PromiseForFakeResponse = Promise<FakeResponse>;
type FakeFetch = jest.Mock<PromiseForFakeResponse>;

/**
 * Takes an array of FetchMatchers, or a single FetchMatcher, and returns a
 * mock fetch function that will return the response specified by the matcher.
 *
 * Note that the matcher will match on all methods.
 *
 * @todo support matching on method as well as path.
 *
 * @param matchers - An array of FetchMatchers, or a single FetchMatcher.
 * @returns An object with two references to the same mock fetch function, one typed as fetch, and one typed as a mock. Also includes a helper function to get the result of a specific fetch call.
 */
export function getFakeFetch(matchers: FetchMatcher[] | FetchMatcher): {
  asFetch: typeof fetch;
  asMock: FakeFetch;
  getResult: (index: number) => PromiseForFakeResponse;
} {
  const fakeFetch: FakeFetch = jest.fn();

  fakeFetch.mockImplementation((...fetchArgs) => {
    const requestedPath = fetchArgs[0];

    let matcher: FetchMatcher | undefined;
    if (Array.isArray(matchers)) {
      // Currently only supports one matcher per path.
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
    getResult: async (index: number) => {
      const value: Promise<FakeResponse> | undefined =
        fakeFetch.mock.results[index]?.value;
      if (!value) {
        throw new Error(`No result found for fetch call at index '${index}'.`);
      }
      return value;
    },
  };
}

/**
 * Get a fake fetch that will have a network error.
 */
export function getFakeFetchWithNetworkError(): {
  asFetch: typeof fetch;
  asMock: FakeFetch;
} {
  const fakeFetch: FakeFetch = jest.fn();

  fakeFetch.mockImplementation(() => {
    return Promise.reject(new Error("Ohhh nooooooo!"));
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
