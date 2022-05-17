import { RequestMethod } from "node-mocks-http";
import { ZodSchema } from "zod";

import useAccessToken from "../../context/Auth/useAccessToken";

type OakFetchProps<ResponseData> = {
  url: string;
  responseDataSchema: ZodSchema<ResponseData>;
  method: RequestMethod;
  body?: XMLHttpRequestBodyInit;
  headers?: HeadersInit;
};

function useOakFetch() {
  const [accessToken] = useAccessToken();

  async function oakFetch<ResponseData>({
    url,
    method,
    responseDataSchema,
    body,
    headers,
  }: OakFetchProps<ResponseData>) {
    // @TODO handle errors in this function
    headers = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    };

    const response = await fetch(url, { method, body, headers });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message);
    }

    const rawData = await response.json();
    const parsedData = responseDataSchema.parse(rawData);

    return parsedData;
  }

  return oakFetch;
}

export default useOakFetch;
