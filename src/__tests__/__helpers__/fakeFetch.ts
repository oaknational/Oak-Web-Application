export interface FetchMatcher {
  path: string;
  jsonValue: Record<string, unknown>;
  response: Promise<{
    ok: boolean;
    status: number;
    json: () => Promise<Record<string, unknown>>;
  }>;
}

/**
 * Takes an array responses to return from fetch, to be returned in order.
 * @param matchers - An array of FetchMatchers, or a single FetchMatcher.
 * @returns
 */
export function getFakeFetch(
  matchers: FetchMatcher[] | FetchMatcher,
): jest.Mock {
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
