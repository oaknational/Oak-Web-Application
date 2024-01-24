export interface ResponseConfig {
  status: number;
  errors?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface FakeResponse {
  ok: boolean;
  status: number;
  THIS_IS_A_FAKE_RESPONSE: string;
  errors?: Record<string, unknown>[];
}

/**
 * Generic interface for a matcher to be used with getFakeFetch.
 */
export interface FetchMatcher {
  path: string;
  response: Promise<FakeResponse>;
}

class NotImplementedError extends Error {
  constructor(message?: string) {
    super(`Please implement in a subclass: ${message}`);
  }
}

/**
 * A generic FetchMatcher class, should only be used to create specific FetchMatcher classes.
 *
 * @todo add static methods to set the fake fetch and restore the real fetch.
 */
export class GenericFetchMatcher implements FetchMatcher {
  protected _path: string;
  protected _responseConfig: ResponseConfig;

  get path() {
    return this._path;
  }

  get response(): Promise<FakeResponse> {
    throw new NotImplementedError();
  }

  protected getBaseResponseData(): FakeResponse {
    const { status, errors } = this._responseConfig;
    const responseData: FakeResponse = {
      ok: !errors,
      status: status,
      THIS_IS_A_FAKE_RESPONSE:
        "If you were expecting a real response make sure you have reinstated the real `fetch` function.",
    };

    return responseData;
  }

  constructor(path: string, response: ResponseConfig) {
    this._path = path;
    this._responseConfig = response;
  }
}

export function buildFetchMatcher<
  FetchMatcherType extends typeof GenericFetchMatcher,
>(
  FetchMatcherClass: FetchMatcherType,
  path: string,
  responseConfig: ResponseConfig,
) {
  return new FetchMatcherClass(path, responseConfig);
}
