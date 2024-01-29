import { GenericFetchMatcher, buildFetchMatcher } from "./generics";
import type { FakeResponse, ResponseConfig } from "./generics";

interface HubspotResponseConfig extends ResponseConfig {
  status: number;
  inlineMessage?: string;
  aSurpriseField?: string;
}

interface HubspotFakeResponse extends FakeResponse {
  aSurpriseField?: string;
  json: () => Promise<{ inlineMessage?: string }>;
}

export type ResponsePromise = Promise<HubspotFakeResponse>;

class HubspotFetchMatcher extends GenericFetchMatcher {
  private get jsonValue() {
    const { inlineMessage, errors }: HubspotResponseConfig =
      this._responseConfig;
    const jsonResponse = inlineMessage ? { inlineMessage } : { errors };
    return jsonResponse;
  }

  get response(): ResponsePromise {
    // Need an IIFE to use await inside a getter 🙄
    const returnData = (async () => {
      const baseResponseData = super.getBaseResponseData();
      const jsonResponse = this.jsonValue;
      const responseData = {
        ...baseResponseData,
        json: () => Promise.resolve(jsonResponse),
      };

      return Promise.resolve(responseData);
    })();
    return returnData;
  }

  constructor(path: string, responseConfig: HubspotResponseConfig) {
    super(path, responseConfig);
  }
}

export function buildHubspotFetchMatcher(
  path: string,
  responseConfig: HubspotResponseConfig,
) {
  return buildFetchMatcher(
    HubspotFetchMatcher,
    path,
    responseConfig,
  ) as HubspotFetchMatcher;
}
