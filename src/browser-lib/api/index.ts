import { z } from "zod";

import useOakFetch from "./useOakFetch";

const useApi = () => {
  const oakFetch = useOakFetch();

  return {
    "/login": ({ accessToken }: { accessToken: string }) =>
      oakFetch({
        url: "/api/login",
        method: "POST",
        responseDataSchema: z.object({
          id: z.number(),
          email: z.string(),
        }),
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      }),
  };
};

export default useApi;
